const exception = (error: unknown) => {
    return {
        success: false,
        message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    }
}

export { exception }