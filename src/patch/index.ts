import { GlobalPatch } from './globalPatch'

export function Patch(): void {
    if (!global.patched) {
        GlobalPatch()
        global.patched = true
    }
}