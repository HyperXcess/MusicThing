import Foundation
import ScreenCaptureKit
import CoreMedia
import CoreGraphics
import Accelerate
func emit(_ value:[String:Any]) { if let data=try? JSONSerialization.data(withJSONObject:value) { FileHandle.standardOutput.write(data);FileHandle.standardOutput.write(Data([10])) } }
final class Capture:NSObject,SCStreamOutput,SCStreamDelegate {
 var stream:SCStream?;var last=Date.distantPast
 let n=1024
 func stream(_ stream:SCStream,didStopWithError error:Error){emit(["status":"error","message":"System audio capture stopped. Reopen Visualizer to retry."])}
 func stream(_ stream:SCStream,didOutputSampleBuffer buffer:CMSampleBuffer,of type:SCStreamOutputType){
  guard type == .audio,Date().timeIntervalSince(last)>0.065,CMSampleBufferIsValid(buffer),let block=CMSampleBufferGetDataBuffer(buffer),let format=CMSampleBufferGetFormatDescription(buffer),let asbd=CMAudioFormatDescriptionGetStreamBasicDescription(format),asbd.pointee.mFormatFlags & kAudioFormatFlagIsFloat != 0 else{return}
  let count=CMBlockBufferGetDataLength(block)/MemoryLayout<Float>.size
  guard count>=n else{return};last=Date()
  var samples=[Float](repeating:0,count:count)
  _=samples.withUnsafeMutableBytes { CMBlockBufferCopyDataBytes(block,atOffset:0,dataLength:count*4,destination:$0.baseAddress!) }
  let frames=CMSampleBufferGetNumSamples(buffer),channels=Int(asbd.pointee.mChannelsPerFrame),planar=asbd.pointee.mFormatFlags & kAudioFormatFlagIsNonInterleaved != 0
  func sample(_ frame:Int,_ channel:Int)->Float {guard frame<frames else{return 0};let index=planar ? channel*frames+frame : frame*channels+channel;return index<samples.count ? samples[index] : 0}
  // Pick the stronger channel: averaging stereo can cancel out-of-phase music.
  let available=min(frames,n)
  var leftPower:Float=0,rightPower:Float=0
  for i in 0..<available {let l=sample(i,0),r=sample(i,min(1,channels-1));leftPower+=l*l;rightPower+=r*r}
  let channel=rightPower>leftPower ? min(1,channels-1) : 0
  var input=(0..<n).map { sample($0,channel) },window=[Float](repeating:0,count:n),imag=[Float](repeating:0,count:n),real=[Float](repeating:0,count:n),outImag=imag
  vDSP_hann_window(&window,vDSP_Length(n),Int32(vDSP_HANN_NORM));vDSP_vmul(input,1,window,1,&input,1,vDSP_Length(n))
  guard let setup=vDSP_DFT_zop_CreateSetup(nil,vDSP_Length(n),.FORWARD) else{return}
  vDSP_DFT_Execute(setup,input,imag,&real,&outImag);vDSP_DFT_DestroySetup(setup)
  var bands=[Float]();let rate=Float(asbd.pointee.mSampleRate)
  for i in 0..<32 {let lo=40*pow(Float(400),Float(i)/32),hi=40*pow(Float(400),Float(i+1)/32);let a=max(1,Int(lo*Float(n)/rate)),b=min(n/2-1,max(a,Int(hi*Float(n)/rate)));var peak:Float=0
   if a<=b {for k in a...b {peak=max(peak,sqrt(real[k]*real[k]+outImag[k]*outImag[k])/Float(n))}}
   let db=20*log10(max(peak,0.000001));bands.append(max(0,min(1,(db+75)/65)))
  }
  emit(["status":"audio","bands":bands])
 }
 func start() async {
  guard CGPreflightScreenCaptureAccess() else {emit(["status":"permission","message":"Allow system audio / screen recording for DeskThing in macOS Privacy & Security, then reopen Visualizer. Audio stays on your Mac." ]);_ = CGRequestScreenCaptureAccess();return}
  do {let content=try await SCShareableContent.excludingDesktopWindows(false,onScreenWindowsOnly:true);guard let display=content.displays.first else{throw NSError(domain:"capture",code:1)}
   let config=SCStreamConfiguration();config.width=2;config.height=2;config.minimumFrameInterval=CMTime(value:1,timescale:1);config.capturesAudio=true;config.excludesCurrentProcessAudio=true;config.sampleRate=48000;config.channelCount=2
   let s=SCStream(filter:SCContentFilter(display:display,excludingWindows:[]),configuration:config,delegate:self);stream=s
   try s.addStreamOutput(self,type:.audio,sampleHandlerQueue:DispatchQueue(label:"musicthing.audio"));try await s.startCapture();emit(["status":"ready","message":"Listening to Mac system audio · local only"])
  }catch {emit(["status":"error","message":"macOS did not allow system audio capture. Check Privacy & Security → Screen & System Audio Recording." ])}
 }
}
let capture=Capture();Task {await capture.start()};RunLoop.main.run()
