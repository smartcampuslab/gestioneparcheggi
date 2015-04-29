package it.smartcampuslab.tm.exception;

public class NotFoundException extends Exception {

	private static final long serialVersionUID = 3136135140264431225L;

	public NotFoundException(String msg) {
		super(msg);
	}

	public NotFoundException() {
		super();
	}

}
