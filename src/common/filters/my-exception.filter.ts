import 
{ 
    ArgumentsHost,
    Catch,
    ExceptionFilter, 
    HttpException
}
    from "@nestjs/common";


@Catch(HttpException)
export class MyExceptionFilter<t extends HttpException>   
 implements ExceptionFilter 
{
    catch(exception: any, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();

        const statusCode = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        const error = typeof response === 'string' ? {
            message: exceptionResponse
        } : (exceptionResponse as object);

        response.status(statusCode).json({
            ...error,
            date: new Date().toISOString(),
            path: request.url
        })
    }
}