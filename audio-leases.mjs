// Each view owns its capture request; closing one view must not stop another.
export function createAudioLeases(now=Date.now){const leases=new Map();return {update(owner,active){if(active)leases.set(owner,now()+7000);else leases.delete(owner)},active(){const t=now();for(const [owner,until]of leases)if(until<=t)leases.delete(owner);return leases.size>0},clear(){leases.clear()}}}
