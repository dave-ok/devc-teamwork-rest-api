export const handleResponse = (res, status, data) => {
    res.status(status).json({
        data: data,
        status: 'success'        
    });
}