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

import it.smartcommunitylab.parking.management.web.bean.DataLogBean;
import it.smartcommunitylab.parking.management.web.model.OccupancyParkingStructure;
import it.smartcommunitylab.parking.management.web.model.OccupancyRateArea;
import it.smartcommunitylab.parking.management.web.model.OccupancyStreet;
import it.smartcommunitylab.parking.management.web.model.OccupancyZone;
import it.smartcommunitylab.parking.management.web.model.ParkingMeter;
import it.smartcommunitylab.parking.management.web.model.ParkingStructure;
import it.smartcommunitylab.parking.management.web.model.ProfitParkingMeter;
import it.smartcommunitylab.parking.management.web.model.ProfitParkingStructure;
import it.smartcommunitylab.parking.management.web.model.ProfitRateArea;
import it.smartcommunitylab.parking.management.web.model.ProfitStreet;
import it.smartcommunitylab.parking.management.web.model.ProfitZone;
import it.smartcommunitylab.parking.management.web.model.RateArea;
import it.smartcommunitylab.parking.management.web.model.Street;
import it.smartcommunitylab.parking.management.web.model.TimeCostParkingStructure;
import it.smartcommunitylab.parking.management.web.model.TimeCostRateArea;
import it.smartcommunitylab.parking.management.web.model.TimeCostStreet;
import it.smartcommunitylab.parking.management.web.model.TimeCostZone;
import it.smartcommunitylab.parking.management.web.model.Zone;

import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

@Service("csvManager")
public class CSVManager {
	
	private static final Logger logger = Logger.getLogger(CSVManager.class);
	private static final String FILE_NAME = "report";
	private static final String CSV_SEPARATOR = ",";
	private static final String CSV_NEWLINE = "\n";
	private static final String CSV_NOVAL = "/";

	public CSVManager() {
		// TODO Auto-generated constructor stub
	}
	
	// Method used to create the csv file for the street occupation
	public String create_supply_file_streets(ArrayList<Street> streets, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "Street.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);
			
			// Added the table cols headers
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			writer.append("Area");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti LC");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti LS");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti P");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti DO");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti R");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti H");
			writer.append(CSV_NEWLINE);
			
			// Add the list of data in a table
			for(Street s : streets){
				writer.append(s.getStreetReference());
				writer.append(CSV_SEPARATOR);
				writer.append(s.getArea_name());	// to convert to area name
				writer.append(CSV_SEPARATOR);
				writer.append(s.getSlotNumber() + "");
				writer.append(CSV_SEPARATOR);
				writer.append(s.getFreeParkSlotSignNumber() + "");
				writer.append(CSV_SEPARATOR);
				writer.append(s.getFreeParkSlotNumber() + "");
				writer.append(CSV_SEPARATOR);
				writer.append(s.getPaidSlotNumber() + "");
				writer.append(CSV_SEPARATOR);
				writer.append(s.getTimedParkSlotNumber() + "");
				writer.append(CSV_SEPARATOR);
				writer.append(s.getReservedSlotNumber() + "");
				writer.append(CSV_SEPARATOR);
				writer.append(s.getHandicappedSlotNumber() + "");
				writer.append(CSV_NEWLINE);
			}
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
	public String create_supply_file_zones(ArrayList<Zone> zones, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "Zone.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);
			
			// Added the table cols headers
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			writer.append("Macro");
			writer.append(CSV_SEPARATOR);
			writer.append("Tipo");
			writer.append(CSV_SEPARATOR);
			writer.append("Note");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_NEWLINE);
			
			// Add the list of data in a table
			for(Zone z : zones){
				writer.append(z.getName());
				writer.append(CSV_SEPARATOR);
				writer.append(z.getSubmacro());	// to convert to area name
				writer.append(CSV_SEPARATOR);
				writer.append(z.getType());
				writer.append(CSV_SEPARATOR);
				writer.append(z.getNote());
				writer.append(CSV_SEPARATOR);
				writer.append(z.getSlotNumber() + "");
				writer.append(CSV_NEWLINE);
			}
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
	public String create_supply_file_areas(ArrayList<RateArea> areas, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "Area.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);
			
			// Added the table cols headers
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			writer.append("Tariffa");
			writer.append(CSV_SEPARATOR);
			writer.append("Orario");
			writer.append(CSV_SEPARATOR);
			writer.append("Servizio telepark");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_NEWLINE);
			
			// Add the list of data in a table
			for(RateArea a : areas){
				writer.append(a.getName());
				writer.append(CSV_SEPARATOR);
				writer.append(a.getFee() + "");	// to convert to area name
				writer.append(CSV_SEPARATOR);
				writer.append(a.getTimeSlot());
				writer.append(CSV_SEPARATOR);
				writer.append(a.getSmsCode());
				writer.append(CSV_SEPARATOR);
				writer.append(a.getSlotNumber() + "");
				writer.append(CSV_NEWLINE);
			}
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
	public String create_supply_file_structs(ArrayList<ParkingStructure> structures, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "Structure.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);
			
			// Added the table cols headers
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			writer.append("Indirizzo");
			writer.append(CSV_SEPARATOR);
			writer.append("Park&Ride");
			writer.append(CSV_SEPARATOR);
			writer.append("Tariffa euro/ora");
			writer.append(CSV_SEPARATOR);
			writer.append("Note tariffa");
			writer.append(CSV_SEPARATOR);
			writer.append("Orario");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti per disabili");
			writer.append(CSV_NEWLINE);
			
			// Add the list of data in a table
			for(ParkingStructure ps : structures){
				writer.append(ps.getName());
				writer.append(CSV_SEPARATOR);
				writer.append(ps.getStreetReference());	// to convert to area name
				writer.append(CSV_SEPARATOR);
				writer.append((ps.isParkAndRide()) ? "Sì" : "No");
				writer.append(CSV_SEPARATOR);
				double fee = 0.0;
				if(ps.getFee_val() >= 0){
					fee = ps.getFee_val() / 100;
				}
				writer.append(cleanCommaValue(fee + ""));
				writer.append(CSV_SEPARATOR);
				writer.append(cleanCommaValue(ps.getFee_note()));
				writer.append(CSV_SEPARATOR);
				writer.append(ps.getTimeSlot());
				writer.append(CSV_SEPARATOR);
				writer.append(ps.getSlotNumber() + "");
				writer.append(CSV_SEPARATOR);
				writer.append((ps.getHandicappedSlotNumber() >= 0) ? (ps.getHandicappedSlotNumber() + "") : "0");
				writer.append(CSV_NEWLINE);
			}
			writer.flush();
			writer.close();
			
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			logger.error("Error in structures csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}	
	
	// Method used to create the csv file for the parkingmeter profit
	public String create_supply_file_parkingmeters(ArrayList<ParkingMeter> parkingmeters, String path)
			throws FileNotFoundException, UnsupportedEncodingException {
		String name = FILE_NAME + "ParkingMeter.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);

			// Added the table cols headers
			writer.append("Codice");
			writer.append(CSV_SEPARATOR);
			writer.append("Note");
			writer.append(CSV_SEPARATOR);
			writer.append("Stato");
			writer.append(CSV_NEWLINE);

			// Add the list of data in a table
			for (ParkingMeter p : parkingmeters) {
				writer.append(p.getCode() + "");
				writer.append(CSV_SEPARATOR);
				writer.append(cleanNewLineValue(p.getNote()));
				writer.append(CSV_SEPARATOR);
				writer.append(p.getStatus() + "");
				writer.append(CSV_NEWLINE);
			}
			// String arr = writer.toString();
			// ba = arr.getBytes();
			writer.flush();
			writer.close();

		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			logger.error("Error in supply parking meter csv creation: " + e1);
		}
		return "csv/" + name; // ba
	}	
	
	// Method used to create the csv file for the street occupation
	public String create_occupancy_file_streets(ArrayList<OccupancyStreet> streets, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "OccupancyStreet.csv";
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
				writer.append(CSV_NEWLINE);
			}
			
			//String arr = writer.toString();
			//ba = arr.getBytes();
			writer.flush();
			writer.close();
			
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			logger.error("Error in occupancy street csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}
	
	// Method used to create the csv file for the zone occupation
	public String create_occupancy_file_zones(ArrayList<OccupancyZone> zones, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "OccupancyZone.csv";
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
			logger.error("Error in occupancy zone csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}
	
	// Method used to create the csv file for the area occupation
	public String create_occupancy_file_areas(ArrayList<OccupancyRateArea> areas, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "OccupancyArea.csv";
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
			logger.error("Error in occupancy area csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}
	
	// Method used to create the csv file for the parking structures occupation
	public String create_occupancy_file_structs(ArrayList<OccupancyParkingStructure> structures, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "OccupancyStructure.csv";
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
			logger.error("Error in occupancy structures csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}
	
	// Method used to create the csv file for the logs history
	public String create_file_log(ArrayList<DataLogBean> logs, String path)
			throws FileNotFoundException, UnsupportedEncodingException {
		String name = FILE_NAME + "Log.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);

			// Added the table cols headers
			writer.append("Id oggetto");
			writer.append(CSV_SEPARATOR);
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			writer.append("Tipo");
			writer.append(CSV_SEPARATOR);
			writer.append("Autore");
			writer.append(CSV_SEPARATOR);
			writer.append("Ora");
			writer.append(CSV_SEPARATOR);
			writer.append("Ora(millisecondi)");
			writer.append(CSV_SEPARATOR);
			writer.append("Periodo");
			writer.append(CSV_SEPARATOR);
			// writer.append("Valore");
			writer.append("Posti Gratuiti");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Occupati Gratuiti");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti a Pagamento");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Occupati a Pagamento");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti a Disco Orario");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Occupati a Disco Orario");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti per Disabili");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Occupati per Disabili");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Occupati Totali");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Non Disponibili");
			writer.append(CSV_SEPARATOR);
			writer.append("Ricavi");
			writer.append(CSV_SEPARATOR);
			writer.append("Ticket emessi");
			writer.append(CSV_NEWLINE);

			// Add the list of data in a table
			for (DataLogBean l : logs) {	
				writer.append(l.getObjId());
				writer.append(CSV_SEPARATOR);
				writer.append(getNameFromValue(l.getValue() + ""));
				writer.append(CSV_SEPARATOR);
				String type = "";
				if(l.getType().compareTo("it.smartcommunitylab.parking.management.web.auxiliary.model.Street") == 0){
					type = "Via";
				} else if(l.getType().compareTo("it.smartcommunitylab.parking.management.web.auxiliary.model.Parking") == 0){
					type = "Parcheggio (Occupazione)";
				} else if(l.getType().compareTo("it.smartcommunitylab.parking.management.web.auxiliary.model.ParkStruct") == 0){
					type = "Parcheggio (Incassi)";
				} else {
					type = "Parcometro";
				}
				writer.append((type));
				writer.append(CSV_SEPARATOR);
				writer.append(l.getAuthor());
				writer.append(CSV_SEPARATOR);
				writer.append(correctDateTime(l.getTime()));
				writer.append(CSV_SEPARATOR);
				writer.append(l.getTime() + "");
				writer.append(CSV_SEPARATOR);
				Long[] period = l.getLogPeriod();
				String periodVal = "Nessuno";
				if(period != null && period.length == 2){
					periodVal = correctDateTime(period[0]) + "-" + correctDateTime(period[1]);
				}
				writer.append(periodVal);
				writer.append(CSV_SEPARATOR);
				writer.append(correctValue(l.getValue() + ""));
				// writer.append(l.getValueToString());
				writer.append(CSV_NEWLINE);
			}
			writer.flush();
			writer.close();

		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			logger.error("Error in log csv creation: " + e1);
		}
		return "csv/" + name; // ba
	}
		
	// Method used to create the csv file for the street profit
	public String create_profit_file_streets(ArrayList<ProfitStreet> streets, String path) throws FileNotFoundException,
			UnsupportedEncodingException {
		String name = FILE_NAME + "ProfitStreet.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);

			// Added the table cols headers
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			writer.append("Area");
			writer.append(CSV_SEPARATOR);
			writer.append("Incasso");
			writer.append(CSV_SEPARATOR);
			writer.append("Num Ticket");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti a Pagamento");
			writer.append(CSV_NEWLINE);

			// Add the list of data in a table
			for (ProfitStreet s : streets) {
				writer.append(s.getStreetReference());
				writer.append(CSV_SEPARATOR);
				writer.append(s.getArea_name()); // to convert to area name
				writer.append(CSV_SEPARATOR);
				writer.append((s.getProfit() > -1) ? (s.getProfit() + "")
						: "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append((s.getTickets() > -1) ? (s.getTickets() + "")
						: "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append(s.getSlotNumber() + "");
				writer.append(CSV_SEPARATOR);
				writer.append(s.getPaidSlotNumber() + "");
				writer.append(CSV_NEWLINE);
			}
			// String arr = writer.toString();
			// ba = arr.getBytes();
			writer.flush();
			writer.close();

		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			logger.error("Error in profit street csv creation: " + e1);
		}
		return "csv/" + name; // ba
	}
		
		
	// Method used to create the csv file for the parkingmeter profit
	public String create_profit_file_parkingmeters(ArrayList<ProfitParkingMeter> parkingmeters, String path)
			throws FileNotFoundException, UnsupportedEncodingException {
		String name = FILE_NAME + "ProfitParkingMeter.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);

			// Added the table cols headers
			writer.append("Codice");
			writer.append(CSV_SEPARATOR);
			writer.append("Note");
			writer.append(CSV_SEPARATOR);
			writer.append("Stato");
			writer.append(CSV_SEPARATOR);
			writer.append("Incasso");
			writer.append(CSV_SEPARATOR);
			writer.append("Num Ticket");
			writer.append(CSV_NEWLINE);

			// Add the list of data in a table
			for (ProfitParkingMeter p : parkingmeters) {
				writer.append(p.getCode() + "");
				writer.append(CSV_SEPARATOR);
				writer.append(cleanNewLineValue(p.getNote()));
				writer.append(CSV_SEPARATOR);
				writer.append(p.getStatus() + "");
				writer.append(CSV_SEPARATOR);
				writer.append((p.getProfit() > -1) ? (p.getProfit() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append((p.getTickets() > -1) ? (p.getTickets() + "")	: "n.p.");
				writer.append(CSV_NEWLINE);
			}
			// String arr = writer.toString();
			// ba = arr.getBytes();
			writer.flush();
			writer.close();

		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			logger.error("Error in profit parking meter csv creation: " + e1);
		}
		return "csv/" + name; // ba
	}
	
	// Method used to create the csv file for the zone profit
	public String create_profit_file_zones(ArrayList<ProfitZone> zones, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "ProfitZone.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);
			
			// Added the table cols headers
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			writer.append("Macro");
			writer.append(CSV_SEPARATOR);
			writer.append("Incasso");
			writer.append(CSV_SEPARATOR);
			writer.append("Num Ticket");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_NEWLINE);
			
			// Add the list of data in a table
			for(ProfitZone z : zones){
				writer.append(z.getName());
				writer.append(CSV_SEPARATOR);
				writer.append(z.getSubmacro());	// to convert to area name
				writer.append(CSV_SEPARATOR);
				writer.append((z.getProfit() > -1) ? (z.getProfit() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append((z.getTickets() > -1) ? (z.getTickets() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append(z.getSlotNumber() + "");
				writer.append(CSV_NEWLINE);
			}
			//String arr = writer.toString();
			//ba = arr.getBytes();
			writer.flush();
			writer.close();
			
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			logger.error("Error in profit zone csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}

	// Method used to create the csv file for the area profit
	public String create_profit_file_areas(ArrayList<ProfitRateArea> areas, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "ProfitArea.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);
			
			// Added the table cols headers
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			writer.append("Tariffa");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_SEPARATOR);
			writer.append("Incassi");
			writer.append(CSV_SEPARATOR);
			writer.append("Num Ticket");
			writer.append(CSV_NEWLINE);
			
			// Add the list of data in a table
			for(ProfitRateArea a : areas){
				writer.append(a.getName());
				writer.append(CSV_SEPARATOR);
				writer.append(a.getFee() + "");	// to convert to area name
				writer.append(CSV_SEPARATOR);
				writer.append(a.getSlotNumber() + "");
				writer.append(CSV_SEPARATOR);
				writer.append((a.getProfit() > -1) ? (a.getProfit() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append((a.getTickets() > -1) ? (a.getTickets() + "") : "n.p.");
				writer.append(CSV_NEWLINE);
			}
			writer.flush();
			writer.close();
			
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			logger.error("Error in profit area csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}
	
	// Method used to create the csv file for the parking structures profit
	public String create_profit_file_structs(ArrayList<ProfitParkingStructure> structures, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "ProfitStructure.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);
			
			// Added the table cols headers
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			writer.append("Indirizzo");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_SEPARATOR);
			writer.append("Incasso");
			writer.append(CSV_SEPARATOR);
			writer.append("Num Ticket");
			writer.append(CSV_NEWLINE);
			
			// Add the list of data in a table
			for(ProfitParkingStructure ps : structures){
				writer.append(ps.getName());
				writer.append(CSV_SEPARATOR);
				writer.append(ps.getStreetReference());	// to convert to area name
				writer.append(CSV_SEPARATOR);
				writer.append(ps.getSlotNumber() + "");
				writer.append(CSV_SEPARATOR);
				writer.append((ps.getProfit() > -1) ? (ps.getProfit() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append((ps.getTickets() > -1) ? (ps.getTickets() + "") : "n.p.");
				writer.append(CSV_NEWLINE);
			}
			writer.flush();
			writer.close();
			
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			logger.error("Error in structures csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}
	
	// Method used to create the csv file for the street time cost
	public String create_timeCost_file_streets(ArrayList<TimeCostStreet> streets, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "TimeCostStreet.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);
			
			// Added the table cols headers
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			writer.append("Area");
			writer.append(CSV_SEPARATOR);
			writer.append("Tempo di accesso Min");
			writer.append(CSV_SEPARATOR);
			writer.append("Tempo di accesso Max");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupazione");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Occupati");
			writer.append(CSV_NEWLINE);
			
			// Add the list of data in a table
			for(TimeCostStreet s : streets){
				writer.append(s.getStreetReference());
				writer.append(CSV_SEPARATOR);
				writer.append(s.getArea_name());	// to convert to area name
				writer.append(CSV_SEPARATOR);
				writer.append((s.getMinExtratime() != -1) ? (s.getMinExtratime() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append((s.getMaxExtratime() != -1) ? (s.getMaxExtratime() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append((s.getOccupancyRate() != -1) ? (s.getOccupancyRate() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append(s.getSlotNumber() + "");
				writer.append(CSV_SEPARATOR);
				writer.append(s.getSlotOccupied() + "");
				writer.append(CSV_NEWLINE);
			}		
			//String arr = writer.toString();
			//ba = arr.getBytes();
			writer.flush();
			writer.close();
				
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			logger.error("Error in timeCost street csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}
	
	// Method used to create the csv file for the zone time cost
	public String create_timeCost_file_zones(ArrayList<TimeCostZone> zones, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "TimeCostZone.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);
				
			// Added the table cols headers
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			writer.append("Macro");
			writer.append(CSV_SEPARATOR);
			writer.append("Tempo di accesso Min");
			writer.append(CSV_SEPARATOR);
			writer.append("Tempo di accesso Max");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupazione");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Occupati");
			writer.append(CSV_NEWLINE);
				
			// Add the list of data in a table
			for(TimeCostZone z : zones){
				writer.append(z.getName());
				writer.append(CSV_SEPARATOR);
				writer.append(z.getSubmacro());	// to convert to area name
				writer.append(CSV_SEPARATOR);
				writer.append((z.getMinExtratime() != -1) ? (z.getMinExtratime() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append((z.getMaxExtratime() != -1) ? (z.getMaxExtratime() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append((z.getOccupancy() != -1) ? (z.getOccupancy() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append(z.getSlotNumber() + "");
				writer.append(CSV_SEPARATOR);
				writer.append(z.getSlotOccupied() + "");
				writer.append(CSV_NEWLINE);
			}
			writer.flush();
			writer.close();
			
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			logger.error("Error timeCost zone csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}

	// Method used to create the csv file for the area time cost
	public String create_timeCost_file_areas(ArrayList<TimeCostRateArea> areas, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "TimeCostArea.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);
			
			// Added the table cols headers
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			writer.append("Tariffa");
			writer.append(CSV_SEPARATOR);
			writer.append("Tempo di accesso Min");
			writer.append(CSV_SEPARATOR);
			writer.append("Tempo di accesso Max");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupazione");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Occupati");
			writer.append(CSV_NEWLINE);
			
			// Add the list of data in a table
			for(TimeCostRateArea a : areas){
				writer.append(a.getName());
				writer.append(CSV_SEPARATOR);
				writer.append(a.getFee() + "");	// to convert to area name
				writer.append(CSV_SEPARATOR);
				writer.append((a.getMinExtratime() != -1) ? (a.getMinExtratime() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append((a.getMaxExtratime() != -1) ? (a.getMaxExtratime() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append((a.getOccupancy() != -1) ? (a.getOccupancy() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append(a.getSlotNumber() + "");
				writer.append(CSV_SEPARATOR);
				writer.append(a.getSlotOccupied() + "");
				writer.append(CSV_NEWLINE);
			}
			writer.flush();
			writer.close();
			
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			logger.error("Error in time cost area csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}
	
	// Method used to create the csv file for the parking structures occupation
	public String create_timeCost_file_structs(ArrayList<TimeCostParkingStructure> structures, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "TimeCostStructure.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);
			
			// Added the table cols headers
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			writer.append("Indirizzo");
			writer.append(CSV_SEPARATOR);
			writer.append("Tempo di accesso Min");
			writer.append(CSV_SEPARATOR);
			writer.append("Tempo di accesso Max");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupazione");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Occupati");
			writer.append(CSV_NEWLINE);
			
			// Add the list of data in a table
			for(TimeCostParkingStructure ps : structures){
				writer.append(ps.getName());
				writer.append(CSV_SEPARATOR);
				writer.append(ps.getStreetReference());	// to convert to area name
				writer.append(CSV_SEPARATOR);
				writer.append((ps.getMinExtratime() != -1) ? (ps.getMinExtratime() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append((ps.getMaxExtratime() != -1) ? (ps.getMaxExtratime() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append((ps.getOccupancyRate() != -1) ? (ps.getOccupancyRate() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append(ps.getSlotNumber() + "");
				writer.append(CSV_SEPARATOR);
				writer.append((ps.getSlotOccupied() >= 0) ? (ps.getSlotOccupied() + "") : "0");
				writer.append(CSV_NEWLINE);
			}
			writer.flush();
			writer.close();
			
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			logger.error("Error in timeCost structures csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}
	
	// Method used to create the csv file for the street occupation
	public String create_occupancy_file_history_streets(Street street, String[][]matrix, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "HistorycalOccupancyStreet.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);
				
			// Added the table cols headers
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			writer.append("Area");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_NEWLINE);
				
			writer.append(street.getStreetReference());
			writer.append(CSV_SEPARATOR);
			writer.append(street.getArea_name());	// to convert to area name
			writer.append(CSV_SEPARATOR);
			writer.append(street.getSlotNumber() + "");
			writer.append(CSV_NEWLINE);
			
			for(int i = 0; i < matrix.length; i++){
				for(int j = 0; j < matrix[i].length; j++){
					if(matrix[i][j].compareTo("-1.0") == 0){
						writer.append(CSV_NOVAL);
					} else {
						writer.append(matrix[i][j]);
					}
					writer.append(CSV_SEPARATOR);
				}
				writer.append(CSV_NEWLINE);
			}
			
			writer.flush();
			writer.close();
				
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			logger.error("Error in historycal street csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}	
	
	// Method used to create the csv file for the street occupation
	public String create_occupancy_file_history_structs(OccupancyParkingStructure struct, String[][]matrix, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "HistorycalOccupancyParking.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);
				
			// Added the table cols headers
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			writer.append("Indirizzo");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_NEWLINE);
					
			writer.append(struct.getName());
			writer.append(CSV_SEPARATOR);
			writer.append(struct.getStreetReference());	// to convert to area name
			writer.append(CSV_SEPARATOR);
			writer.append(struct.getSlotNumber() + "");
			writer.append(CSV_NEWLINE);
			
			for(int i = 0; i < matrix.length; i++){
				for(int j = 0; j < matrix[i].length; j++){
					if(matrix[i][j].compareTo("-1.0") == 0){
						writer.append(CSV_NOVAL);
					} else {
						writer.append(matrix[i][j]);
					}
					writer.append(CSV_SEPARATOR);
				}
				writer.append(CSV_NEWLINE);
			}
			
			writer.flush();
			writer.close();
				
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			logger.error("Error in historycal struct csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}		
	
	// Method used to create the csv file for the street occupation
	public String create_profit_file_history_parkingmeters(ProfitParkingMeter parkingMeter, String[][]matrix, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "HistorycalProfitParkingMeter.csv";
		String long_name = path + "/" + name;
		String[][] matrixProfit = null;
		String[][] matrixTickets = null;
		if(matrix != null && matrix[0] != null && matrix[0].length > 0){
			matrixProfit = new String[matrix.length][matrix[0].length];
			matrixTickets = new String[matrix.length][matrix[0].length];
		
			try {
				FileWriter writer = new FileWriter(long_name);
	
				// Added the table cols headers
				writer.append("Codice");
				writer.append(CSV_SEPARATOR);
				writer.append("Note");
				writer.append(CSV_SEPARATOR);
				writer.append("Area");
				writer.append(CSV_NEWLINE);
					
				writer.append(parkingMeter.getCode() + "");
				writer.append(CSV_SEPARATOR);
				writer.append(cleanNewLineValue(parkingMeter.getNote()));	// to convert to area name
				writer.append(CSV_SEPARATOR);
				writer.append(parkingMeter.getAreaId());
				writer.append(CSV_NEWLINE);
				
				for(int i = 0; i < matrix.length; i++){
					for(int j = 0; j < matrix[i].length; j++){
						if(i == 0 && j == 0){
							matrixProfit[i][j] = matrix[i][j];
							matrixTickets[i][j] = matrix[i][j];
						} else {
							String[] res = matrix[i][j].split("/");
							if(res.length < 2){
								matrixProfit[i][j] = matrix[i][j];
								matrixTickets[i][j] = matrix[i][j];
							} else {
								String profit = res[0];
								String tickets = res[1];
								matrixProfit[i][j] = profit;
								matrixTickets[i][j] = tickets;
							}	
						}
					}
				}
				
				writer.append(CSV_NEWLINE);
				writer.append("Incasso in euro");
				writer.append(CSV_NEWLINE);
				for(int i = 0; i < matrixProfit.length; i++){
					for(int j = 0; j < matrixProfit[i].length; j++){
						
						if(matrixProfit[i][j].compareTo("-1.0") == 0){
							writer.append(CSV_NOVAL);
						} else {
							if(i == 0 || j == 0){
								writer.append(matrixProfit[i][j]);
							} else {
								double profit = Double.parseDouble(matrixProfit[i][j]);
								double profVal = profit / 100;
								writer.append(String.format("%.2f", profVal));
							}
						}
						writer.append(CSV_SEPARATOR);
					}
					writer.append(CSV_NEWLINE);
				}
				
				writer.append(CSV_NEWLINE);
				writer.append("Ticket");
				writer.append(CSV_NEWLINE);
				for(int i = 0; i < matrixTickets.length; i++){
					for(int j = 0; j < matrixTickets[i].length; j++){
						
						if(matrixTickets[i][j].compareTo("-1.0") == 0){
							writer.append(CSV_NOVAL);
						} else {
							if(i == 0 || j == 0){
								writer.append(matrixTickets[i][j]);
							} else {
								double tickets = Double.parseDouble(matrixTickets[i][j]);
								writer.append(String.format("%.0f", tickets));
							}
						}
						writer.append(CSV_SEPARATOR);
					}
					writer.append(CSV_NEWLINE);
				}
				
				writer.flush();
				writer.close();
	
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
				logger.error("Error in historycal profit parking meter csv creation: " + e1);
			}		
		}
		
		return "csv/" + name;	//ba
	}
	
	// Method used to create the csv file for the street occupation
	public String create_profit_file_history_structs(ProfitParkingStructure struct, String[][]matrix, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "HistorycalProfitParkstruct.csv";
		String long_name = path + "/" + name;
		String[][] matrixProfit = null;
		String[][] matrixTickets = null;
		if(matrix != null && matrix[0] != null && matrix[0].length > 0){
			matrixProfit = new String[matrix.length][matrix[0].length];
			matrixTickets = new String[matrix.length][matrix[0].length];
			try {
				FileWriter writer = new FileWriter(long_name);
						
				// Added the table cols headers
				writer.append("Nome");
				writer.append(CSV_SEPARATOR);
				writer.append("Indirizzo");
				writer.append(CSV_SEPARATOR);
				writer.append("Posti Totali");
				writer.append(CSV_NEWLINE);
							
				writer.append(struct.getName());
				writer.append(CSV_SEPARATOR);
				writer.append(struct.getStreetReference());	// to convert to area name
				writer.append(CSV_SEPARATOR);
				writer.append(struct.getSlotNumber() + "");
				writer.append(CSV_NEWLINE);
					
				for(int i = 0; i < matrix.length; i++){
					for(int j = 0; j < matrix[i].length; j++){
						if(i == 0 && j == 0){
							matrixProfit[i][j] = matrix[i][j];
							matrixTickets[i][j] = matrix[i][j];
						} else {
							String[] res = matrix[i][j].split("/");
							if(res.length < 2){
								matrixProfit[i][j] = matrix[i][j];
								matrixTickets[i][j] = matrix[i][j];
							} else {
								String profit = res[0];
								String tickets = res[1];
								matrixProfit[i][j] = profit;
								matrixTickets[i][j] = tickets;
							}	
						}
					}
				}
				
				writer.append(CSV_NEWLINE);
				writer.append("Incasso in euro");
				writer.append(CSV_NEWLINE);
				for(int i = 0; i < matrixProfit.length; i++){
					for(int j = 0; j < matrixProfit[i].length; j++){
						
						if(matrixProfit[i][j].compareTo("-1.0") == 0){
							writer.append(CSV_NOVAL);
						} else {
							if(i == 0 || j == 0){
								writer.append(matrixProfit[i][j]);
							} else {
								double profit = Double.parseDouble(matrixProfit[i][j]);
								double profVal = profit / 100;
								writer.append(String.format("%.2f", profVal));
							}
						}
						writer.append(CSV_SEPARATOR);
					}
					writer.append(CSV_NEWLINE);
				}
				
				writer.append(CSV_NEWLINE);
				writer.append("Ticket");
				writer.append(CSV_NEWLINE);
				for(int i = 0; i < matrixTickets.length; i++){
					for(int j = 0; j < matrixTickets[i].length; j++){
						if(matrixTickets[i][j].compareTo("-1.0") == 0){
							writer.append(CSV_NOVAL);
						} else {
							if(i == 0 || j == 0){
								writer.append(matrixTickets[i][j]);
							} else {
								double tickets = Double.parseDouble(matrixTickets[i][j]);
								writer.append(String.format("%.0f", tickets));
							}
						}
						writer.append(CSV_SEPARATOR);
					}
					writer.append(CSV_NEWLINE);
				}
				
				writer.flush();
				writer.close();
					
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
				logger.error("Error in historycal profit struct csv creation: " + e1);
			}
		}
		return "csv/" + name;	//ba
	}
	
	// Method used to create the csv file for the street occupation
	public String create_timecost_file_history_streets(Street street, String[][]matrix, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "HistorycalTimeCostStreet.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);
				
			// Added the table cols headers
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			writer.append("Area");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_NEWLINE);
				
			writer.append(street.getStreetReference());
			writer.append(CSV_SEPARATOR);
			writer.append(street.getArea_name());	// to convert to area name
			writer.append(CSV_SEPARATOR);
			writer.append(street.getSlotNumber() + "");
			writer.append(CSV_NEWLINE);
				
			for(int i = 0; i < matrix.length; i++){
				for(int j = 0; j < matrix[i].length; j++){
					if(i == 0 || j == 0){
						writer.append(matrix[i][j]);
					} else {
						if(matrix[i][j].compareTo("-1.0") == 0){
							writer.append(CSV_NOVAL);
						} else {
							writer.append(matrix[i][j] + " min");
						}
					}
					writer.append(CSV_SEPARATOR);
				}
				writer.append(CSV_NEWLINE);
			}
			
			writer.flush();
			writer.close();
				
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			logger.error("Error in historycal street csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}
	
	// Method used to create the csv file for the street occupation
	public String create_timecost_file_history_structs(OccupancyParkingStructure struct, String[][]matrix, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "HistorycalTimecostParking.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);
				
			// Added the table cols headers
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			writer.append("Indirizzo");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_NEWLINE);
					
			writer.append(struct.getName());
			writer.append(CSV_SEPARATOR);
			writer.append(struct.getStreetReference());	// to convert to area name
			writer.append(CSV_SEPARATOR);
			writer.append(struct.getSlotNumber() + "");
			writer.append(CSV_NEWLINE);
			
			for(int i = 0; i < matrix.length; i++){
				for(int j = 0; j < matrix[i].length; j++){
					if(i == 0 || j == 0){
						writer.append(matrix[i][j]);
					} else {
						if(matrix[i][j].compareTo("-1.0") == 0){
							writer.append(CSV_NOVAL);
						} else {
							writer.append(matrix[i][j] + " min");
						}
					}
					writer.append(CSV_SEPARATOR);
				}
				writer.append(CSV_NEWLINE);
			}
			
			writer.flush();
			writer.close();
				
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			logger.error("Error in historycal timecost struct csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}	
		
	private String correctValue(String value) {
		String freeSlots = "0";
		String occupiedFreeSlots = "0";
		String payingSlots = "0";
		String occupiedPayingSlots = "0";
		String timedSlots = "0";
		String occupiedTimedSlots = "0";
		String handicappedSlots = "0";
		String occupiedHandicappedSlots = "0";
		String totalSlots = "0";
		String occupiedTotalSlots = "0";
		String unavailableSlots = "0";
		String profit = "0";
		String tickets = "0";
		String to_clean = value.toString();
		// logger.error("Value in CSV: " + to_clean);
		String completeVals[] = to_clean.split(",");
		for (String s : completeVals) {
			if (s.contains("slotsFree")) {
				freeSlots = s.substring(s.indexOf("=") + 1, s.length());
			}
			if (s.contains("slotsOccupiedOnFree")) {
				occupiedFreeSlots = s.substring(s.indexOf("=") + 1, s.length());
			}
			if (s.contains("slotsPaying")) {
				payingSlots = s.substring(s.indexOf("=") + 1, s.length());
			}
			if (s.contains("slotsOccupiedOnPaying")) {
				occupiedPayingSlots = s.substring(s.indexOf("=") + 1,
						s.length());
			}
			if (s.contains("slotsTimed")) {
				timedSlots = s.substring(s.indexOf("=") + 1, s.length());
			}
			if (s.contains("slotsOccupiedOnTimed")) {
				occupiedTimedSlots = s
						.substring(s.indexOf("=") + 1, s.length());
			}
			if (s.contains("slotsHandicapped")) {
				handicappedSlots = s.substring(s.indexOf("=") + 1, s.length());
			}
			if (s.contains("slotsOccupiedOnHandicapped")) {
				occupiedHandicappedSlots = s.substring(s.indexOf("=") + 1,
						s.length());
			}
			if (s.contains("slotsTotal")) {
				totalSlots = s.substring(s.indexOf("=") + 1, s.length());
			}
			if (s.contains("slotsOccupiedOnTotal")) {
				occupiedTotalSlots = s
						.substring(s.indexOf("=") + 1, s.length());
			}
			if (s.contains("slotsUnavailable")) {
				unavailableSlots = s.substring(s.indexOf("=") + 1, s.length());
			}
			if (s.contains("profit")) {
				profit = s.substring(s.indexOf("=") + 1, s.length());
			}
			if (s.contains("tickets")) {
				tickets = s.substring(s.indexOf("=") + 1, s.length());
			}
		}

		// String cleaned = to_clean.replaceAll(",", " / ");
		// cleaned = cleaned.substring(1, cleaned.length()-1);
		String cleaned = freeSlots + "," + occupiedFreeSlots + ","
				+ payingSlots + "," + occupiedPayingSlots + "," + timedSlots
				+ "," + occupiedTimedSlots + "," + handicappedSlots + ","
				+ occupiedHandicappedSlots + "," + totalSlots + ","
				+ occupiedTotalSlots + "," + unavailableSlots + ","
				+ profit + "," + tickets;
		return cleaned;
	}
		
	// Method getNameFromValue: extract the object name from the value
	private String getNameFromValue(String value) {
		String name = "";
		String to_clean = value.toString();
		// logger.error("Value in CSV: " + to_clean);
		String completeVals[] = to_clean.split(",");
		for (String s : completeVals) {
			if (s.contains("name")) {
				name = s.substring(s.indexOf("=") + 1, s.length());
			} else if(s.contains("code")) {	// Case for parcometro
				name = s.substring(s.indexOf("=") + 1, s.length());
			}
		}
		return name;
	}
		
	// Method correctDateTime: used to cast the long milliseconds value in a formatted date
	private String correctDateTime(Long millis) {
		if (millis != null) {
			Date data = new Date(millis);
			DateFormat df = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
			return df.format(data);
		} else {
			return "n.p.";
		}
	}
		
	// Method cleanNewLineValue: used to remove the new line chars (\n) from a string
	private String cleanNewLineValue(String data) {
		String cleanedVal = data;
		if (data.contains("\n")) {
			cleanedVal = data.replaceAll("\n", " ");
		}
		return cleanedVal;
	}
	
	// Method cleanCommaValue: used to remove the comma chars from a string
	private String cleanCommaValue(String data) {
		String cleanedVal = data;
		if (data.contains(",")) {
			cleanedVal = data.replaceAll(",", ".");
		}
		return cleanedVal;
	}

}
