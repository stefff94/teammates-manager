package it.polste.attsw.teammatesmanagerbackend.exceptions;

public class TeammateNotExistsException extends RuntimeException {

  private static final long serialVersionUID = 8491889381204662759L;

  public TeammateNotExistsException(String message) {
    super(message);
  }
}
