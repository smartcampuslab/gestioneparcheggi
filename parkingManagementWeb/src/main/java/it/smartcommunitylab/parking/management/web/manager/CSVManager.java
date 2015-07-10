/*******************************************************************************
 * Copyright 2015 Fondazione Bruno Kessler
 * 
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 * 
 *        http://www.apache.org/licenses/LICENSE-2.0
 * 
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 ******************************************************************************/
package it.smartcommunitylab.parking.management.web.manager;

import it.smartcommunitylab.parking.management.web.model.OccupancyParkingStructure;
import it.smartcommunitylab.parking.management.web.model.OccupancyRateArea;
import it.smartcommunitylab.parking.management.web.model.OccupancyStreet;
import it.smartcommunitylab.parking.management.web.model.OccupancyZone;

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
	private static final String FILE_NAME = "report";
	private static final String CSV_SEPARATOR = ",";
	private static final String CSV_NEWLINE = "\n";

	public CSVManager() {
		// TODO Auto-generated constructor stub
	}
	
	// Method used to create the csv file for the street occupation
	public String create_file_streets(ArrayList<OccupancyStreet> streets, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "Street.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);
			
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
				writer.append(s.getArea_name());	// to convert to area name
				writer.append(CSV_SEPARATOR);
				writer.append((s.getOccupancyRate() != -1) ? (s.getOccupancyRate() + "") : "n.p.");
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
			
			//String arr = writer.toString();
			//ba = arr.getBytes();
			writer.flush();
			writer.close();
			
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			logger.error("Error in street csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}
	
	// Method used to create the csv file for the zone occupation
	public String create_file_zones(ArrayList<OccupancyZone> zones, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "Zone.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);
			
			// Added the table cols headers
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			writer.append("Macro");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupazione");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Occupati");
			writer.append(CSV_NEWLINE);
			
			// Add the list of data in a table
			for(OccupancyZone z : zones){
				writer.append(z.getName());
				writer.append(CSV_SEPARATOR);
				writer.append(z.getSubmacro());	// to convert to area name
				writer.append(CSV_SEPARATOR);
				writer.append((z.getOccupancy() != -1) ? (z.getOccupancy() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append(z.getSlotNumber() + "");
				writer.append(CSV_SEPARATOR);
				writer.append(z.getSlotOccupied() + "");
				writer.append(CSV_NEWLINE);
			}
			
			//String arr = writer.toString();
			//ba = arr.getBytes();
			writer.flush();
			writer.close();
			
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			logger.error("Error in zone csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}
	
	// Method used to create the csv file for the area occupation
	public String create_file_areas(ArrayList<OccupancyRateArea> areas, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "Area.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);
			
			// Added the table cols headers
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			writer.append("Tariffa");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupazione");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Occupati");
			writer.append(CSV_NEWLINE);
			
			// Add the list of data in a table
			for(OccupancyRateArea a : areas){
				writer.append(a.getName());
				writer.append(CSV_SEPARATOR);
				writer.append(a.getFee() + "");	// to convert to area name
				writer.append(CSV_SEPARATOR);
				writer.append((a.getOccupancy() != -1) ? (a.getOccupancy() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append(a.getSlotNumber() + "");
				writer.append(CSV_SEPARATOR);
				writer.append(a.getSlotOccupied() + "");
				writer.append(CSV_NEWLINE);
			}
			
			//String arr = writer.toString();
			//ba = arr.getBytes();
			writer.flush();
			writer.close();
			
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			logger.error("Error in area csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}
	
	// Method used to create the csv file for the parking structures occupation
	public String create_file_structs(ArrayList<OccupancyParkingStructure> structures, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "Structure.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);
			
			// Added the table cols headers
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			writer.append("Indirizzo");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupazione");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Occupati");
			writer.append(CSV_NEWLINE);
			
			// Add the list of data in a table
			for(OccupancyParkingStructure ps : structures){
				writer.append(ps.getName());
				writer.append(CSV_SEPARATOR);
				writer.append(ps.getStreetReference());	// to convert to area name
				writer.append(CSV_SEPARATOR);
				writer.append((ps.getOccupancyRate() != -1) ? (ps.getOccupancyRate() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append(ps.getSlotNumber() + "");
				writer.append(CSV_SEPARATOR);
				writer.append((ps.getSlotOccupied() >= 0) ? (ps.getSlotOccupied() + "") : "0");
				writer.append(CSV_NEWLINE);
			}
			
			//String arr = writer.toString();
			//ba = arr.getBytes();
			writer.flush();
			writer.close();
			
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			logger.error("Error in structures csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}

}
