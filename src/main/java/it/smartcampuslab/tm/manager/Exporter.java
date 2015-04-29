package it.smartcampuslab.tm.manager;

import it.smartcampuslab.tm.exception.ExportException;

public interface Exporter {
	public byte[] export() throws ExportException;

}
