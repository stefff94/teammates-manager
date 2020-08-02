package it.polste.attsw.teammatesmanagerbackend.exceptions;

public class TeammateAlreadyExistsException extends RuntimeException {

  private static final long serialVersionUID = 7423819945893466047L;

  public TeammateAlreadyExistsException(String message) {
    super(message);
  }
}
