package it.polste.attsw.teammatesmanagerbackend.exceptions;

import it.polste.attsw.teammatesmanagerbackend.controllers.TeammateRestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice(assignableTypes = TeammateRestController.class)
public class TeammateRestControllerExceptionHandler extends ResponseEntityExceptionHandler {

  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  @ExceptionHandler(TeammateNotExistsException.class)
  public ResponseEntity<Object> handleTeammateNotExistException(
          Exception e) {

    return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(getExceptionBody(e));
  }

  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  @ExceptionHandler(TeammateAlreadyExistsException.class)
  public ResponseEntity<Object> handleTeammateAlreadyExistsException(
          Exception e) {

    return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(getExceptionBody(e));
  }

  private Object getExceptionBody(Exception e) {
    Map<String, String> body = new HashMap<>();
    body.put("message", e.getMessage());

    return body;
  }

}
