package it.smartcommunitylab.parking.management.web.manager;

import it.smartcommunitylab.parking.management.web.exception.ExportException;

public interface Exporter {
	public byte[] export() throws ExportException;

}
