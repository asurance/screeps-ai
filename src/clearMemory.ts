for (const key in Memory) {
    delete Memory[key as keyof Memory]
}