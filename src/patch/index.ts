import { GlobalPatch } from './globalPatch'

let isReset = true
export function Patch(): void {
    if (isReset) {
        GlobalPatch()
        isReset = false
    }
}