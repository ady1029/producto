package cu.aica.product_resource.utils.exception;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.*;

@ControllerAdvice
public class CustomGlobalExceptionHandler extends ResponseEntityExceptionHandler {


//    @Validate For Validating Path Variables and Request Parameters
//    @ExceptionHandler(ConstraintViolationException.class)
//    public void constraintViolationException(HttpServletResponse response) throws IOException {
//        response.sendError(HttpStatus.BAD_REQUEST.value());
//    }

    // error handle for @Valid
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", new Date());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
//        body.put("message", ex.getMessage());
        body.put("locale", request.getLocale());
        body.put("message", "Validation failed for object: '"+ex.getBindingResult().getObjectName()+"'. ErrorResponse count: "+ex.getBindingResult().getErrorCount());

        List<ErrorResponse> errors = new ArrayList<>();
        ex.getBindingResult().getAllErrors().stream().forEach(error -> {

            String fields;
            String message = error.getDefaultMessage();

            if (error instanceof FieldError){
                fields =((FieldError) error).getField();
            } else {
                fields = Arrays.toString((String[]) error.getArguments()[1]).replace("[", "").replace("]", "");
            }
            errors.add(new ErrorResponse(fields, message));
        });

        body.put("errors", errors);
        body.put("path", ((ServletWebRequest)request).getRequest().getRequestURI());

        return new ResponseEntity<>(body, headers, status);
    }

    @Override
    protected ResponseEntity<Object> handleNoHandlerFoundException(NoHandlerFoundException ex, HttpHeaders headers, HttpStatus status, WebRequest request){

        Map<String, Object> body = new LinkedHashMap<>();

        return new ResponseEntity<>(body, headers, status);
    }
}
