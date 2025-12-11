export const apiSuccess = (res, data, message = "Success", status = 200) => {
    return res.status(status).json({
        success: true,
        message,
        data,
    });
};

export const apiError = (res, error, message = "Something went wrong", status = 500) => {
    return res.status(status).json({
        success: false,
        message,
        error: error?.message || error,
    });
};
