package it.smartcommunitylab.parking.management.web.manager;

import it.smartcommunitylab.parking.management.web.model.OccupancyStreet;

import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

@Service("csvManager")
public class CSVManager {
	
	private static final Logger logger = Logger.getLogger(CSVManager.class);
	private static final String FILE_NAME = "exportedList";
	private static final String CSV_SEPARATOR = ",";
	private static final String CSV_NEWLINE = "\n";

	public CSVManager() {
		// TODO Auto-generated constructor stub
	}
	
	//@SuppressWarnings("restriction")
	public String create_file_streets(ArrayList<OccupancyStreet> streets, String path) throws FileNotFoundException, UnsupportedEncodingException{
			
		String name = FILE_NAME + "Street.csv";
		try {
			FileWriter writer = new FileWriter(path + name);
			
			// Added the table cols headers
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			writer.append("Area");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupazione");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Occupati (LC)");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Occupati (LS)");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Occupati (P)");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Occupati (DO)");
			writer.append(CSV_NEWLINE);
			
			// Add the list of data in a table
			for(OccupancyStreet s : streets){
				writer.append(s.getStreetReference());
				writer.append(CSV_SEPARATOR);
				writer.append(s.getAreaName());	// to convert to area name
				writer.append(CSV_SEPARATOR);
				writer.append(s.getOccupation() + "");
				writer.append(CSV_SEPARATOR);
				writer.append(s.getSlotNumber() + "");
				writer.append(CSV_SEPARATOR);
				writer.append(s.getFreeParkSlotSignOccupied() + "");
				writer.append(CSV_SEPARATOR);
				writer.append(s.getFreeParkSlotOccupied() + "");
				writer.append(CSV_SEPARATOR);
				writer.append(s.getPaidSlotOccupied() + "");
				writer.append(CSV_SEPARATOR);
				writer.append(s.getTimedParkSlotOccupied() + "");
				writer.append(CSV_SEPARATOR);
				writer.append(CSV_NEWLINE);
			}
			
			writer.flush();
			writer.close();
			
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			logger.error("Error in csv creation: " + e1);
		}
		return name;
	}

}
