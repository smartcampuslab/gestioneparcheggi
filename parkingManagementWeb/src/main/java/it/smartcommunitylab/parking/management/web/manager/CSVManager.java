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

import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

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
import it.smartcommunitylab.parking.management.web.model.slots.VehicleSlot;
import it.smartcommunitylab.parking.management.web.model.slots.VehicleType;
import it.smartcommunitylab.parking.management.web.utils.VehicleTypeDataSetup;

@Service("csvManager")
public class CSVManager {
	
	@Autowired
	private VehicleTypeDataSetup vehicleTypeDataSetup;
	
	private static final Logger logger = Logger.getLogger(CSVManager.class);
	private static final String FILE_NAME = "report";
	private static final String CSV_SEPARATOR = ",";
	private static final String CSV_NEWLINE = "\n";
	private static final String CSV_NOVAL = "/";

	private String csvHeaders[] = {"Id oggetto","Nome","Tipo","Autore","Ora","Ora(millisecondi)","Periodo","Mezzo","Posti Gratuiti","Posti Occupati Gratuiti","Posti Gratuiti Con Segnaletica","Posti Occupati Gratuiti Con Segnaletica","Posti a Pagamento","Posti Occupati a Pagamento","Posti a Disco Orario","Posti Occupati a Disco Orario","Posti per Disabili","Posti Occupati per Disabili","Posti Car Sharing","Posti Occupati Car Sharing","Posti Riservati","Posti Occupati Riservati","Posti Rosa","Posti Occupati Rosa","Posti con Ricarica Elettrica","Posti Occupati con Ricarica Elettrica","Posti Carico Scarico","Posti Occupati Carico Scarico","Posti Totali","Posti Occupati Totali","Posti Non Disponibili","Ricavi","Ticket emessi"};
	private String valueFields[] = {"slotsFree","slotsOccupiedOnFree","slotsFreeSigned","slotsOccupiedOnFreeSigned","slotsPaying","slotsOccupiedOnPaying","slotsTimed","slotsOccupiedOnTimed","slotsHandicapped","slotsOccupiedOnHandicapped","slotsReserved","slotsOccupiedOnReserved","slotsRechargeable","slotsOccupiedOnRechargeable","slotsCarSharing","slotsOccupiedOnCarSharing","slotsLoadingUnloading","slotsOccupiedOnLoadingUnloading","slotsPink","slotsOccupiedOnPink","slotsTotal","slotsOccupiedOnTotal","slotsUnavailable","profit","tickets"};
	
	public CSVManager() {
	}
	
	// Method used to retrieve a vehicle type description string from the vehicle type key in slot configuration
	private String castVechicleTypeToDescription(String v_type){
		List<VehicleType> allVehicles = vehicleTypeDataSetup.getVehicleTypes();
		for(VehicleType vt : allVehicles){
			if(vt.getName().compareTo(v_type) == 0){
				if(vt.getDescription().contains("posti per ")){
					return vt.getDescription().replace("posti per ", "");
				} else {
					return vt.getDescription();
				}
			}
		}
		return "Tutti";
	};
	
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
			writer.append("Configurazione posti");
			writer.append(CSV_NEWLINE);
			
			VehicleSlot emptyConf = new VehicleSlot();
			emptyConf.setVehicleType("All");
			emptyConf.setVehicleTypeActive(true);
			emptyConf.setSlotNumber(0);
			emptyConf.setCarSharingSlotNumber(0);
			emptyConf.setCarSharingSlotOccupied(0);
			emptyConf.setFreeParkSlotNumber(0);
			emptyConf.setFreeParkSlotOccupied(0);
			emptyConf.setFreeParkSlotSignNumber(0);
			emptyConf.setFreeParkSlotSignOccupied(0);
			emptyConf.setHandicappedSlotNumber(0);
			emptyConf.setHandicappedSlotOccupied(0);
			emptyConf.setLoadingUnloadingSlotNumber(0);
			emptyConf.setLoadingUnloadingSlotOccupied(0);
			emptyConf.setPaidSlotNumber(0);
			emptyConf.setPaidSlotOccupied(0);
			emptyConf.setPinkSlotNumber(0);
			emptyConf.setPinkSlotOccupied(0);
			emptyConf.setRechargeableSlotNumber(0);
			emptyConf.setRechargeableSlotOccupied(0);
			emptyConf.setReservedSlotNumber(0);
			emptyConf.setReservedSlotOccupied(0);
			emptyConf.setTimedParkSlotNumber(0);
			emptyConf.setTimedParkSlotOccupied(0);
			emptyConf.setUnusuableSlotNumber(0);
			
			// Add the list of data in a table
			for(Street s : streets){
				List<VehicleSlot> streetConfig = s.getSlotsConfiguration();
				writer.append(cleanCommaValue(s.getStreetReference()));
				writer.append(CSV_SEPARATOR);
				writer.append(cleanCommaValue(s.getArea_name()));	// to convert to area name
				writer.append(CSV_SEPARATOR);
				writer.append(s.getSlotNumber() + "");
				writer.append(CSV_SEPARATOR);
				for(int i = 0; i < streetConfig.size(); i++){
					VehicleSlot streetConf = mergeSlotConf(streetConfig.get(i), emptyConf);
					streetConf.setVehicleType(streetConfig.get(i).getVehicleType());
					streetConf.setVehicleTypeActive(streetConfig.get(i).getVehicleTypeActive());
					if(streetConf.getVehicleTypeActive()){
						writer.append(castVechicleTypeToDescription(streetConf.getVehicleType()) + "");
						writer.append(CSV_SEPARATOR);
						writer.append("LC: " + streetConf.getFreeParkSlotSignNumber() + "");
						writer.append(CSV_SEPARATOR);
						writer.append("LS: " + streetConf.getFreeParkSlotNumber() + "");
						writer.append(CSV_SEPARATOR);
						writer.append("P: " + streetConf.getPaidSlotNumber() + "");
						writer.append(CSV_SEPARATOR);
						writer.append("DO: " + streetConf.getTimedParkSlotNumber() + "");
						writer.append(CSV_SEPARATOR);
						writer.append("H: " + streetConf.getHandicappedSlotNumber() + "");
						writer.append(CSV_SEPARATOR);
						writer.append("R: " + streetConf.getReservedSlotNumber() + "");
						writer.append(CSV_SEPARATOR);
						writer.append("E: " + streetConf.getRechargeableSlotNumber() + "");
						writer.append(CSV_SEPARATOR);
						writer.append("C/S: " + streetConf.getLoadingUnloadingSlotNumber() + "");
						writer.append(CSV_SEPARATOR);
						writer.append("RO: " + streetConf.getPinkSlotNumber() + "");
						writer.append(CSV_SEPARATOR);
						writer.append("CS: " + streetConf.getCarSharingSlotNumber() + "");
						writer.append(CSV_SEPARATOR);
					}
				}
				writer.append(CSV_NEWLINE);
			}
			writer.flush();
			writer.close();
			
		} catch (IOException e1) {
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
				writer.append(cleanCommaValue(z.getName()));
				writer.append(CSV_SEPARATOR);
				String macro = z.getSubmacro();
				String micro = z.getSubmicro();
				if(micro == null)micro = "";
				writer.append((macro != null && macro.compareTo("") != 0) ? macro : micro);	// to convert to area name
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
			writer.append("Servizio telepark");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_NEWLINE);
			
			// Add the list of data in a table
			for(RateArea a : areas){
				writer.append(cleanCommaValue(a.getName()));	// to convert to area name
				writer.append(CSV_SEPARATOR);
				writer.append((a.getValidityPeriod()!= null && !a.getValidityPeriod().isEmpty()) ? a.feePeriodsSummary() : "");		// used to get a string that is the summary of the fee period data
				writer.append(CSV_SEPARATOR);
				writer.append(a.getSmsCode());
				writer.append(CSV_SEPARATOR);
				writer.append(a.getSlotNumber() + "");
				writer.append(CSV_NEWLINE);
			}
			writer.flush();
			writer.close();
			
		} catch (IOException e1) {
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
			writer.append("Tariffa");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_SEPARATOR);
			writer.append("Configurazione Posti");
			writer.append(CSV_NEWLINE);
			
			VehicleSlot emptyConf = new VehicleSlot();
			emptyConf.setVehicleType("All");
			emptyConf.setVehicleTypeActive(true);
			emptyConf.setSlotNumber(0);
			emptyConf.setCarSharingSlotNumber(0);
			emptyConf.setCarSharingSlotOccupied(0);
			emptyConf.setFreeParkSlotNumber(0);
			emptyConf.setFreeParkSlotOccupied(0);
			emptyConf.setFreeParkSlotSignNumber(0);
			emptyConf.setFreeParkSlotSignOccupied(0);
			emptyConf.setHandicappedSlotNumber(0);
			emptyConf.setHandicappedSlotOccupied(0);
			emptyConf.setLoadingUnloadingSlotNumber(0);
			emptyConf.setLoadingUnloadingSlotOccupied(0);
			emptyConf.setPaidSlotNumber(0);
			emptyConf.setPaidSlotOccupied(0);
			emptyConf.setPinkSlotNumber(0);
			emptyConf.setPinkSlotOccupied(0);
			emptyConf.setRechargeableSlotNumber(0);
			emptyConf.setRechargeableSlotOccupied(0);
			emptyConf.setReservedSlotNumber(0);
			emptyConf.setReservedSlotOccupied(0);
			emptyConf.setTimedParkSlotNumber(0);
			emptyConf.setTimedParkSlotOccupied(0);
			emptyConf.setUnusuableSlotNumber(0);
			
			// Add the list of data in a table
			for(ParkingStructure ps : structures){
				List<VehicleSlot> psConfig = ps.getSlotsConfiguration();
				writer.append(cleanCommaValue(ps.getName()));
				writer.append(CSV_SEPARATOR);
				writer.append(cleanCommaValue(ps.getStreetReference()));
				writer.append(CSV_SEPARATOR);
				writer.append((ps.getParkAndRide()) ? "Si" : "No");
				writer.append(CSV_SEPARATOR);
				writer.append((ps.getValidityPeriod()!= null && !ps.getValidityPeriod().isEmpty()) ? ps.feePeriodsSummary() : "");
				writer.append(CSV_SEPARATOR);
				writer.append(ps.getSlotNumber() + "");
				writer.append(CSV_SEPARATOR);
				for(int i = 0; i < psConfig.size(); i++){
					VehicleSlot psConf = mergeSlotConf(psConfig.get(i), emptyConf);
					psConf.setVehicleType(psConfig.get(i).getVehicleType());
					psConf.setVehicleTypeActive(psConfig.get(i).getVehicleTypeActive());
					if(psConf.getVehicleTypeActive()){
						writer.append(castVechicleTypeToDescription(psConf.getVehicleType()) + "");
						writer.append(CSV_SEPARATOR);
						writer.append("LC: " + psConf.getFreeParkSlotSignNumber() + "");
						writer.append(CSV_SEPARATOR);
						writer.append("LS: " + psConf.getFreeParkSlotNumber() + "");
						writer.append(CSV_SEPARATOR);
						writer.append("P: " + psConf.getPaidSlotNumber() + "");
						writer.append(CSV_SEPARATOR);
						writer.append("DO: " + psConf.getTimedParkSlotNumber() + "");
						writer.append(CSV_SEPARATOR);
						writer.append("H: " + psConf.getHandicappedSlotNumber() + "");
						writer.append(CSV_SEPARATOR);
						writer.append("R: " + psConf.getReservedSlotNumber() + "");
						writer.append(CSV_SEPARATOR);
						writer.append("E: " + psConf.getRechargeableSlotNumber() + "");
						writer.append(CSV_SEPARATOR);
						writer.append("C/S: " + psConf.getLoadingUnloadingSlotNumber() + "");
						writer.append(CSV_SEPARATOR);
						writer.append("RO: " + psConf.getPinkSlotNumber() + "");
						writer.append(CSV_SEPARATOR);
						writer.append("CS: " + psConf.getCarSharingSlotNumber() + "");
						writer.append(CSV_SEPARATOR);
					}
				}
				writer.append(CSV_NEWLINE);
			}
			writer.flush();
			writer.close();
			
		} catch (IOException e1) {
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
				writer.append((p.getNote() != null) ? cleanNewLineValue(p.getNote()) : "");
				writer.append(CSV_SEPARATOR);
				writer.append(p.getStatus() + "");
				writer.append(CSV_NEWLINE);
			}
			// String arr = writer.toString();
			// ba = arr.getBytes();
			writer.flush();
			writer.close();

		} catch (IOException e1) {
			e1.printStackTrace();
			logger.error("Error in supply parking meter csv creation: " + e1);
		}
		return "csv/" + name; // ba
	}
	    
	// Method used to get the correct object slot configuration from the vehicle type specified in the filter
	private VehicleSlot getCorrectConfType(List<VehicleSlot> sc, String vehicleType){
		VehicleSlot emptyConf = new VehicleSlot();
		emptyConf.setVehicleType("All");
		emptyConf.setVehicleTypeActive(true);
		emptyConf.setSlotNumber(0);
		emptyConf.setCarSharingSlotNumber(0);
		emptyConf.setCarSharingSlotOccupied(0);
		emptyConf.setFreeParkSlotNumber(0);
		emptyConf.setFreeParkSlotOccupied(0);
		emptyConf.setFreeParkSlotSignNumber(0);
		emptyConf.setFreeParkSlotSignOccupied(0);
		emptyConf.setHandicappedSlotNumber(0);
		emptyConf.setHandicappedSlotOccupied(0);
		emptyConf.setLoadingUnloadingSlotNumber(0);
		emptyConf.setLoadingUnloadingSlotOccupied(0);
		emptyConf.setPaidSlotNumber(0);
		emptyConf.setPaidSlotOccupied(0);
		emptyConf.setPinkSlotNumber(0);
		emptyConf.setPinkSlotOccupied(0);
		emptyConf.setRechargeableSlotNumber(0);
		emptyConf.setRechargeableSlotOccupied(0);
		emptyConf.setReservedSlotNumber(0);
		emptyConf.setReservedSlotOccupied(0);
		emptyConf.setTimedParkSlotNumber(0);
		emptyConf.setTimedParkSlotOccupied(0);
		emptyConf.setUnusuableSlotNumber(0);
		
		VehicleSlot completeConf = null;
	    if(sc != null && !sc.isEmpty()){
	    	if(vehicleType.compareTo("") != 0 && vehicleType.compareTo("ALL") != 0){
		   		for(int i = 0; i < sc.size(); i++){								// check if vehicle type active
		   			if(sc.get(i).getVehicleType().compareTo(vehicleType) == 0 && sc.get(i).getVehicleTypeActive() == true){
		   				completeConf = mergeSlotConf(sc.get(i), emptyConf);
		   				completeConf.setVehicleType(sc.get(i).getVehicleType());
		   				completeConf.setVehicleTypeActive(sc.get(i).getVehicleTypeActive());
		   			}
		   		}
	    	} else {
	    		completeConf = emptyConf;
	    		for(int i = 0; i < sc.size(); i++){
	    			if(sc.get(i).getVehicleTypeActive() == true){	// check if vehicle type active
	    				completeConf = mergeSlotConf(sc.get(i), completeConf);
	    			}
		   		}
	    	}
	    }
	    return completeConf;
	}
	    
	VehicleSlot mergeSlotConf (VehicleSlot new_sc, VehicleSlot old_sc){
		VehicleSlot merged_sc = new VehicleSlot();
		merged_sc.setVehicleType("ALL");
		merged_sc.setVehicleTypeActive(true);
		int slotNumber = old_sc.getSlotNumber() + ((new_sc.getSlotNumber() != null) ? new_sc.getSlotNumber() : 0);
		int handicappedSlotNumber = old_sc.getHandicappedSlotNumber() + ((new_sc.getHandicappedSlotNumber() != null) ? new_sc.getHandicappedSlotNumber() : 0);
		int handicappedSlotOccupied = old_sc.getHandicappedSlotOccupied() + ((new_sc.getHandicappedSlotOccupied() != null) ? new_sc.getHandicappedSlotOccupied() : 0);
		int reservedSlotNumber = old_sc.getReservedSlotNumber() + ((new_sc.getReservedSlotNumber() != null) ? new_sc.getReservedSlotNumber() : 0);
		int reservedSlotOccupied = old_sc.getReservedSlotOccupied() + ((new_sc.getReservedSlotOccupied() != null) ? new_sc.getReservedSlotOccupied() : 0);
		int timedParkSlotNumber = old_sc.getTimedParkSlotNumber() + ((new_sc.getTimedParkSlotNumber() != null) ? new_sc.getTimedParkSlotNumber() : 0);
		int timedParkSlotOccupied = old_sc.getTimedParkSlotOccupied() + ((new_sc.getTimedParkSlotOccupied() != null) ? new_sc.getTimedParkSlotOccupied() : 0);
		int paidSlotNumber = old_sc.getPaidSlotNumber() + ((new_sc.getPaidSlotNumber() != null) ? new_sc.getPaidSlotNumber() : 0);
		int paidSlotOccupied = old_sc.getPaidSlotOccupied() + ((new_sc.getPaidSlotOccupied() != null) ? new_sc.getPaidSlotOccupied() : 0);
		int freeParkSlotNumber = old_sc.getFreeParkSlotNumber() + ((new_sc.getFreeParkSlotNumber() != null) ? new_sc.getFreeParkSlotNumber() : 0);
		int freeParkSlotOccupied = old_sc.getFreeParkSlotOccupied() + ((new_sc.getFreeParkSlotOccupied() != null) ? new_sc.getFreeParkSlotOccupied() : 0);
		int freeParkSlotSignNumber = old_sc.getFreeParkSlotSignNumber() + ((new_sc.getFreeParkSlotSignNumber() != null) ? new_sc.getFreeParkSlotSignNumber() : 0);
		int freeParkSlotSignOccupied = old_sc.getFreeParkSlotSignOccupied() + ((new_sc.getFreeParkSlotSignOccupied() != null) ? new_sc.getFreeParkSlotSignOccupied() : 0);
		int rechargeableSlotNumber = old_sc.getRechargeableSlotNumber() + ((new_sc.getRechargeableSlotNumber() != null) ? new_sc.getRechargeableSlotNumber() : 0);
		int rechargeableSlotOccupied = old_sc.getRechargeableSlotOccupied() + ((new_sc.getRechargeableSlotOccupied() != null) ? new_sc.getRechargeableSlotOccupied() : 0);
		int loadingUnloadingSlotNumber = old_sc.getLoadingUnloadingSlotNumber() + ((new_sc.getLoadingUnloadingSlotNumber() != null) ? new_sc.getLoadingUnloadingSlotNumber() : 0);
		int loadingUnloadingSlotOccupied = old_sc.getLoadingUnloadingSlotOccupied() + ((new_sc.getLoadingUnloadingSlotOccupied() != null) ? new_sc.getLoadingUnloadingSlotOccupied() : 0);
		int pinkSlotNumber = old_sc.getPinkSlotNumber() + ((new_sc.getPinkSlotNumber() != null) ? new_sc.getPinkSlotNumber() : 0);
		int pinkSlotOccupied = old_sc.getPinkSlotOccupied() + ((new_sc.getPinkSlotOccupied() != null) ? new_sc.getPinkSlotOccupied() : 0);
		int carSharingSlotNumber = old_sc.getCarSharingSlotNumber() + ((new_sc.getCarSharingSlotNumber() != null) ? new_sc.getCarSharingSlotNumber() : 0);
		int carSharingSlotOccupied = old_sc.getCarSharingSlotOccupied() + ((new_sc.getCarSharingSlotOccupied() != null) ? new_sc.getCarSharingSlotOccupied() : 0);
		int unusuableSlotNumber = old_sc.getUnusuableSlotNumber() + ((new_sc.getUnusuableSlotNumber() != null) ? new_sc.getUnusuableSlotNumber() : 0);
		merged_sc.setSlotNumber(slotNumber);
		merged_sc.setHandicappedSlotNumber(handicappedSlotNumber);
		merged_sc.setHandicappedSlotOccupied(handicappedSlotOccupied);
		merged_sc.setReservedSlotNumber(reservedSlotNumber);
		merged_sc.setReservedSlotOccupied(reservedSlotOccupied);
		merged_sc.setTimedParkSlotNumber(timedParkSlotNumber);
		merged_sc.setTimedParkSlotOccupied(timedParkSlotOccupied);
		merged_sc.setPaidSlotNumber(paidSlotNumber);
		merged_sc.setPaidSlotOccupied(paidSlotOccupied);
		merged_sc.setFreeParkSlotNumber(freeParkSlotNumber);
		merged_sc.setFreeParkSlotOccupied(freeParkSlotOccupied);
		merged_sc.setFreeParkSlotSignNumber(freeParkSlotSignNumber);
		merged_sc.setFreeParkSlotSignOccupied(freeParkSlotSignOccupied);
		merged_sc.setRechargeableSlotNumber(rechargeableSlotNumber);
		merged_sc.setRechargeableSlotOccupied(rechargeableSlotOccupied);
		merged_sc.setLoadingUnloadingSlotNumber(loadingUnloadingSlotNumber);
		merged_sc.setLoadingUnloadingSlotOccupied(loadingUnloadingSlotOccupied);
		merged_sc.setPinkSlotNumber(pinkSlotNumber);
		merged_sc.setPinkSlotOccupied(pinkSlotOccupied);
		merged_sc.setCarSharingSlotNumber(carSharingSlotNumber);
		merged_sc.setCarSharingSlotOccupied(carSharingSlotOccupied);
		merged_sc.setUnusuableSlotNumber(unusuableSlotNumber);
	    return merged_sc;
	}
	
	// Method used to create the csv file for the street occupation
	public String create_occupancy_file_streets(ArrayList<OccupancyStreet> streets, String path, String vehicleType) throws FileNotFoundException, UnsupportedEncodingException{
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
			writer.append("Tipo Veicolo");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupati LC");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupati LS");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupati P");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupati DO");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupati H");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupati R");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupati E");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupati C/S");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupati RO");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupati CS");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupati ND");
			writer.append(CSV_NEWLINE);
			
			// Add the list of data in a table
			for(OccupancyStreet s : streets){
				VehicleSlot streetConf = getCorrectConfType(s.getSlotsConfiguration(), vehicleType);
				writer.append(cleanCommaValue(s.getStreetReference()));
				writer.append(CSV_SEPARATOR);
				writer.append(cleanCommaValue(s.getArea_name()));
				writer.append(CSV_SEPARATOR);
				writer.append((s.getOccupancyRate() != -1) ? (s.getOccupancyRate() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append(s.getSlotNumber() + "");
				writer.append(CSV_SEPARATOR);
				if(streetConf != null){
					writer.append(castVechicleTypeToDescription(streetConf.getVehicleType()) + "");
					writer.append(CSV_SEPARATOR);
					writer.append(streetConf.getFreeParkSlotSignOccupied() + "");
					writer.append(CSV_SEPARATOR);
					writer.append(streetConf.getFreeParkSlotOccupied() + "");
					writer.append(CSV_SEPARATOR);
					writer.append(streetConf.getPaidSlotOccupied() + "");
					writer.append(CSV_SEPARATOR);
					writer.append(streetConf.getTimedParkSlotOccupied() + "");
					writer.append(CSV_SEPARATOR);
					writer.append(streetConf.getHandicappedSlotOccupied() + "");
					writer.append(CSV_SEPARATOR);
					writer.append(streetConf.getReservedSlotOccupied() + "");
					writer.append(CSV_SEPARATOR);
					writer.append(streetConf.getRechargeableSlotOccupied() + "");
					writer.append(CSV_SEPARATOR);
					writer.append(streetConf.getLoadingUnloadingSlotOccupied() + "");
					writer.append(CSV_SEPARATOR);
					writer.append(streetConf.getPinkSlotOccupied() + "");
					writer.append(CSV_SEPARATOR);
					writer.append(streetConf.getCarSharingSlotOccupied() + "");
					writer.append(CSV_SEPARATOR);
					writer.append(streetConf.getUnusuableSlotNumber() + "");
					writer.append(CSV_SEPARATOR);
				}
				writer.append(CSV_NEWLINE);
			}
			
			writer.flush();
			writer.close();
			
		} catch (IOException e1) {
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
				writer.append(cleanCommaValue(z.getName()));
				writer.append(CSV_SEPARATOR);
				String macro = z.getSubmacro();
				String micro = z.getSubmicro();
				if(micro == null)micro = "";
				writer.append((macro != null) ? macro : micro);	// to convert to area name
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
				writer.append(cleanCommaValue(a.getName()));
				writer.append(CSV_SEPARATOR);
				writer.append((a.getValidityPeriod()!= null && !a.getValidityPeriod().isEmpty()) ? a.feePeriodsSummary() : "");		// used to get a string that is the summary of the fee period data
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
			e1.printStackTrace();
			logger.error("Error in occupancy area csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}
	
	// Method used to create the csv file for the parking structures occupation
	public String create_occupancy_file_structs(ArrayList<OccupancyParkingStructure> structures, String path, String vehicleType) throws FileNotFoundException, UnsupportedEncodingException{
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
			writer.append("Tipo Veicolo");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupati LC");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupati LS");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupati P");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupati DO");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupati H");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupati R");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupati E");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupati C/S");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupati RO");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupati CS");
			writer.append(CSV_SEPARATOR);
			writer.append("Occupati ND");
			writer.append(CSV_NEWLINE);
			
			// Add the list of data in a table
			for(OccupancyParkingStructure ps : structures){
				VehicleSlot structConf = getCorrectConfType(ps.getSlotsConfiguration(), vehicleType);
				writer.append(cleanCommaValue(ps.getName()));
				writer.append(CSV_SEPARATOR);
				writer.append(cleanCommaValue(ps.getStreetReference()));
				writer.append(CSV_SEPARATOR);
				writer.append((ps.getOccupancyRate() != -1) ? (ps.getOccupancyRate() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append(ps.getSlotNumber() + "");
				writer.append(CSV_SEPARATOR);
				if(structConf != null){
					writer.append(castVechicleTypeToDescription(structConf.getVehicleType()) + "");
					writer.append(CSV_SEPARATOR);
					writer.append(structConf.getFreeParkSlotSignOccupied() + "");
					writer.append(CSV_SEPARATOR);
					writer.append(structConf.getFreeParkSlotOccupied() + "");
					writer.append(CSV_SEPARATOR);
					writer.append(structConf.getPaidSlotOccupied() + "");
					writer.append(CSV_SEPARATOR);
					writer.append(structConf.getTimedParkSlotOccupied() + "");
					writer.append(CSV_SEPARATOR);
					writer.append(structConf.getHandicappedSlotOccupied() + "");
					writer.append(CSV_SEPARATOR);
					writer.append(structConf.getReservedSlotOccupied() + "");
					writer.append(CSV_SEPARATOR);
					writer.append(structConf.getRechargeableSlotOccupied() + "");
					writer.append(CSV_SEPARATOR);
					writer.append(structConf.getLoadingUnloadingSlotOccupied() + "");
					writer.append(CSV_SEPARATOR);
					writer.append(structConf.getPinkSlotOccupied() + "");
					writer.append(CSV_SEPARATOR);
					writer.append(structConf.getCarSharingSlotOccupied() + "");
					writer.append(CSV_SEPARATOR);
					writer.append(structConf.getUnusuableSlotNumber() + "");
					writer.append(CSV_SEPARATOR);
				}
				writer.append(CSV_NEWLINE);
			}
			//String arr = writer.toString();
			//ba = arr.getBytes();
			writer.flush();
			writer.close();
			
		} catch (IOException e1) {
			e1.printStackTrace();
			logger.error("Error in occupancy structures csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}
	
	// Method used to create the csv file for the logs history
	// obsolete
//	public String create_file_log(ArrayList<DataLogBean> logs, String path)
//			throws FileNotFoundException, UnsupportedEncodingException {
//		String name = FILE_NAME + "Log.csv";
//		String long_name = path + "/" + name;
//		try {
//			FileWriter writer = new FileWriter(long_name);
//
//			// Added the table cols headers
//			writer.append("Id oggetto");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Nome");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Tipo");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Autore");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Ora");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Ora(millisecondi)");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Periodo");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Mezzo");
//			writer.append(CSV_SEPARATOR);
//			// writer.append("Valore");
//			writer.append("Posti Gratuiti");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Posti Occupati Gratuiti");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Posti Gratuiti Con Segnaletica");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Posti Occupati Gratuiti Con Segnaletica");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Posti a Pagamento");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Posti Occupati a Pagamento");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Posti a Disco Orario");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Posti Occupati a Disco Orario");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Posti per Disabili");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Posti Occupati per Disabili");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Posti Car Sharing");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Posti Occupati Car Sharing");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Posti Riservati");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Posti Occupati Riservati");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Posti Rosa");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Posti Occupati Rosa");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Posti con Ricarica Elettrica");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Posti Occupati con Ricarica Elettrica");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Posti Carico Scarico");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Posti Occupati Carico Scarico");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Posti Totali");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Posti Occupati Totali");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Posti Non Disponibili");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Ricavi");
//			writer.append(CSV_SEPARATOR);
//			writer.append("Ticket emessi");
//			writer.append(CSV_NEWLINE);
//
//			// Add the list of data in a table
//			for (DataLogBean l : logs) {	
//				writer.append(l.getObjId());
//				writer.append(CSV_SEPARATOR);
//				writer.append(getNameFromValue(l.getValue() + ""));
//				writer.append(CSV_SEPARATOR);
//				String type = "";
//				if(l.getType().compareTo("it.smartcommunitylab.parking.management.web.auxiliary.model.Street") == 0){
//					type = "Via";
//				} else if(l.getType().compareTo("it.smartcommunitylab.parking.management.web.auxiliary.model.Parking") == 0){
//					type = "Parcheggio (Occupazione)";
//				} else if(l.getType().compareTo("it.smartcommunitylab.parking.management.web.auxiliary.model.ParkStruct") == 0){
//					type = "Parcheggio (Incassi)";
//				} else {
//					type = "Parcometro";
//				}
//				writer.append((type));
//				writer.append(CSV_SEPARATOR);
//				writer.append(l.getAuthor());
//				writer.append(CSV_SEPARATOR);
//				writer.append(correctDateTime(l.getTime()));
//				writer.append(CSV_SEPARATOR);
//				writer.append(l.getTime() + "");
//				writer.append(CSV_SEPARATOR);
//				Long[] period = l.getLogPeriod();
//				String periodVal = "Nessuno";
//				if(period != null && period.length == 2){
//					periodVal = correctDateTime(period[0]) + "-" + correctDateTime(period[1]);
//				}
//				writer.append(periodVal);
//				writer.append(CSV_SEPARATOR);
//				writer.append(correctValue(l.getValue()));
//				// writer.append(l.getValueToString());
//				writer.append(CSV_NEWLINE);
//			}
//			writer.flush();
//			writer.close();
//
//		} catch (IOException e1) {
//			e1.printStackTrace();
//			logger.error("Error in log csv creation: " + e1);
//		}
//		return "csv/" + name; // ba
//	}
	
	public void exportAll(List<DataLogBean> logs, OutputStream os)
			throws FileNotFoundException, UnsupportedEncodingException {
		PrintWriter writer = new PrintWriter(os);
		ObjectMapper mapper = new ObjectMapper();
		
		try {
			StringBuilder sb = new StringBuilder();
			for (String h: csvHeaders) {
				sb.append(h + CSV_SEPARATOR);
			}
			String s = sb.toString();
			s = s.substring(0, s.length() - 1);
			
			// Added the table cols headers
			writer.append(s);
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
				Map valueMap = mapper.readValue(l.getValueString(), Map.class);
				writer.append(correctValue(valueMap));
				writer.append(CSV_NEWLINE);
			}
			writer.flush();
			writer.close();

		} catch (Exception e1) {
			e1.printStackTrace();
			logger.error("Error in log csv creation: " + e1);
		}
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
			/*writer.append(CSV_SEPARATOR);
			writer.append("Posti a Pagamento");*/
			writer.append(CSV_NEWLINE);

			// Add the list of data in a table
			for (ProfitStreet s : streets) {
				writer.append(cleanCommaValue(s.getStreetReference()));
				writer.append(CSV_SEPARATOR);
				writer.append(cleanCommaValue(s.getArea_name()));	// to convert to area name
				writer.append(CSV_SEPARATOR);
				writer.append((s.getProfit() > -1) ? (s.getProfit() + "")
						: "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append((s.getTickets() > -1) ? (s.getTickets() + "")
						: "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append(s.getSlotNumber() + "");
				// TODO: manage vehicle type slots correctly
				//writer.append(CSV_SEPARATOR);
				//writer.append(s.getPaidSlotNumber() + "");
				writer.append(CSV_NEWLINE);
			}
			// String arr = writer.toString();
			// ba = arr.getBytes();
			writer.flush();
			writer.close();

		} catch (IOException e1) {
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
				writer.append(cleanCommaValue(z.getName()));
				writer.append(CSV_SEPARATOR);
				String macro = z.getSubmacro();
				String micro = z.getSubmicro();
				if(micro == null)micro = "";
				writer.append((macro != null) ? macro : micro);	// to convert to area name
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
				writer.append(cleanCommaValue(a.getName()));
				writer.append(CSV_SEPARATOR);
				//writer.append(a.getFee() + "");	// to convert to area name
				writer.append((a.getValidityPeriod()!= null && !a.getValidityPeriod().isEmpty()) ? a.feePeriodsSummary() : "");		// used to get a string that is the summary of the fee period data
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
				writer.append(cleanCommaValue(ps.getName()));
				writer.append(CSV_SEPARATOR);
				writer.append(cleanCommaValue(ps.getStreetReference()));
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
				writer.append(cleanCommaValue(s.getStreetReference()));
				writer.append(CSV_SEPARATOR);
				writer.append(cleanCommaValue(s.getArea_name()));	// to convert to area name
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
				writer.append(cleanCommaValue(z.getName()));
				writer.append(CSV_SEPARATOR);
				String macro = z.getSubmacro();
				writer.append((macro != null) ? macro : "");
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
				writer.append(cleanCommaValue(a.getName()));
				writer.append(CSV_SEPARATOR);
				//writer.append(a.getFee() + "");	// to convert to area name
				writer.append((a.getValidityPeriod()!= null && !a.getValidityPeriod().isEmpty()) ? a.feePeriodsSummary() : "");		// used to get a string that is the summary of the fee period data
				writer.append(CSV_SEPARATOR);
				writer.append((a.getMinExtratime() != null && a.getMinExtratime() != -1) ? (a.getMinExtratime() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append((a.getMaxExtratime() != null && a.getMaxExtratime() != -1) ? (a.getMaxExtratime() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append((a.getOccupancy() != null && a.getOccupancy() != -1) ? (a.getOccupancy() + "") : "n.p.");
				writer.append(CSV_SEPARATOR);
				writer.append(a.getSlotNumber() + "");
				writer.append(CSV_SEPARATOR);
				writer.append(a.getSlotOccupied() + "");
				writer.append(CSV_NEWLINE);
			}
			writer.flush();
			writer.close();
			
		} catch (IOException e1) {
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
				writer.append(cleanCommaValue(ps.getName()));
				writer.append(CSV_SEPARATOR);
				writer.append(cleanCommaValue(ps.getStreetReference()));
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
				
			writer.append(cleanCommaValue(street.getStreetReference()));
			writer.append(CSV_SEPARATOR);
			writer.append(cleanCommaValue(street.getArea_name()));	// to convert to area name
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
			e1.printStackTrace();
			logger.error("Error in historycal street csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}
	
	// Method used to create the csv file for the zone occupation
	public String create_occupancy_file_history_zone(OccupancyZone zone, String[][]matrix, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "HistorycalOccupancyZone.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);
				
			// Added the table cols headers
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			if(zone.getSubmacro() != null){
				writer.append("Macro");
			} else {
				writer.append("Cod");
			}
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_NEWLINE);
							
			writer.append(cleanCommaValue(zone.getName()));
			writer.append(CSV_SEPARATOR);
			if(zone.getSubmacro() != null){
				writer.append(zone.getSubmacro());
			} else {
				writer.append(zone.getSubmicro());
			}
			writer.append(CSV_SEPARATOR);
			writer.append(zone.getSlotNumber() + "");
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
			e1.printStackTrace();
			logger.error("Error in historycal occupancy zone csv creation: " + e1);
		}
		return "csv/" + name;
	}
	
	// Method used to create the csv file for the area occupation
	public String create_occupancy_file_history_area(OccupancyRateArea area, String[][]matrix, String path, String ratePeriods) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "HistorycalOccupancyArea.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);
				
			// Added the table cols headers
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			writer.append("Tariffa");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_NEWLINE);
							
			writer.append(cleanCommaValue(area.getName()));
			writer.append(CSV_SEPARATOR);
			//writer.append(area.getFee() + " euro/ora");
			writer.append(ratePeriods);		// used to get a string that is the summary of the fee period data
			writer.append(CSV_SEPARATOR);
			writer.append(area.getSlotNumber() + "");
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
			e1.printStackTrace();
			logger.error("Error in historycal occupancy area csv creation: " + e1);
		}
		return "csv/" + name;
	}	
	
	// Method used to create the csv file for the ps occupation
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
					
			writer.append(cleanCommaValue(struct.getName()));
			writer.append(CSV_SEPARATOR);
			writer.append(cleanCommaValue(struct.getStreetReference()));
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
			e1.printStackTrace();
			logger.error("Error in historycal struct csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}
	
	// Method used to create the csv file for the street profit
	public String create_profit_file_history_street(Street street, String[][]matrix, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "HistorycalProfitStreet.csv";
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
				writer.append("Area");
				writer.append(CSV_SEPARATOR);
				writer.append("Posti Totali");
				writer.append(CSV_NEWLINE);
					
				writer.append(cleanCommaValue(street.getStreetReference()));
				writer.append(CSV_SEPARATOR);
				writer.append(cleanCommaValue(street.getArea_name()));	// to convert to area name
				writer.append(CSV_SEPARATOR);
				writer.append(street.getSlotNumber() + "");
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
				e1.printStackTrace();
				logger.error("Error in historycal profit parking meter csv creation: " + e1);
			}		
		}
		return "csv/" + name;
	}	
	
	// Method used to create the csv file for the parkingmeters profit
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
				e1.printStackTrace();
				logger.error("Error in historycal profit parking meter csv creation: " + e1);
			}		
		}
		
		return "csv/" + name;
	}
	
	// Method used to create the csv file for the zone profit
	public String create_profit_file_history_zone(ProfitZone zone, String[][]matrix, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "HistorycalProfitZone.csv";
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
				if(zone.getSubmacro() != null){
					writer.append("Macro");
				} else {
					writer.append("Cod");
				}
				writer.append(CSV_SEPARATOR);
				writer.append("Posti Totali");
				writer.append(CSV_NEWLINE);
								
				writer.append(cleanCommaValue(zone.getName()));
				writer.append(CSV_SEPARATOR);
				if(zone.getSubmacro() != null){
					writer.append(zone.getSubmacro());
				} else {
					writer.append(zone.getSubmicro());
				}
				writer.append(CSV_SEPARATOR);
				writer.append(zone.getSlotNumber() + "");
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
				e1.printStackTrace();
				logger.error("Error in historycal profit zone csv creation: " + e1);
			}		
		}
		
		return "csv/" + name;
	}	
	
	// Method used to create the csv file for the zone profit
	public String create_profit_file_history_area(ProfitRateArea area, String[][]matrix, String path, String ratePeriods) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "HistorycalProfitArea.csv";
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
				writer.append("Tariffa");
				writer.append(CSV_SEPARATOR);
				writer.append("Posti Totali");
				writer.append(CSV_NEWLINE);
								
				writer.append(cleanCommaValue(area.getName()));
				writer.append(CSV_SEPARATOR);
				//writer.append(area.getFee() + " euro/ora");
				writer.append(ratePeriods);
				writer.append(CSV_SEPARATOR);
				writer.append(area.getSlotNumber() + "");
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
				e1.printStackTrace();
				logger.error("Error in historycal profit area csv creation: " + e1);
			}		
		}
		return "csv/" + name;
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
							
				writer.append(cleanCommaValue(struct.getName()));
				writer.append(CSV_SEPARATOR);
				writer.append(cleanCommaValue(struct.getStreetReference()));
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
				
			writer.append(cleanCommaValue(street.getStreetReference()));
			writer.append(CSV_SEPARATOR);
			writer.append(cleanCommaValue(street.getArea_name()));	// to convert to area name
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
			e1.printStackTrace();
			logger.error("Error in historycal street csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}
	
	// Method used to create the csv file for the street occupation
	public String create_timecost_file_history_zone(OccupancyZone zone, String[][]matrix, String path) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "HistorycalTimeCostZone.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);
				
			// Added the table cols headers
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			if(zone.getSubmacro() != null){
				writer.append("Macro");
			} else {
				writer.append("Cod");
			}
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_NEWLINE);
										
			writer.append(cleanCommaValue(zone.getName()));
			writer.append(CSV_SEPARATOR);
			if(zone.getSubmacro() != null){
				writer.append(zone.getSubmacro());
			} else {
				writer.append(zone.getSubmicro());
			}
			writer.append(CSV_SEPARATOR);
			writer.append(zone.getSlotNumber() + "");
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
			e1.printStackTrace();
			logger.error("Error in historycal zone csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}	
	
	// Method used to create the csv file for the street occupation
	public String create_timecost_file_history_area(OccupancyRateArea area, String[][]matrix, String path, String ratePeriods) throws FileNotFoundException, UnsupportedEncodingException{
		String name = FILE_NAME + "HistorycalTimeCostArea.csv";
		String long_name = path + "/" + name;
		try {
			FileWriter writer = new FileWriter(long_name);
				
			// Added the table cols headers
			writer.append("Nome");
			writer.append(CSV_SEPARATOR);
			writer.append("Tariffa");
			writer.append(CSV_SEPARATOR);
			writer.append("Posti Totali");
			writer.append(CSV_NEWLINE);
										
			writer.append(cleanCommaValue(area.getName()));
			writer.append(CSV_SEPARATOR);
			//writer.append(area.getFee() + " euro/ora");
			writer.append(ratePeriods);
			writer.append(CSV_SEPARATOR);
			writer.append(area.getSlotNumber() + "");
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
			e1.printStackTrace();
			logger.error("Error in historycal area csv creation: " + e1);
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
					
			writer.append(cleanCommaValue(struct.getName()));
			writer.append(CSV_SEPARATOR);
			writer.append(cleanCommaValue(struct.getStreetReference()));
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
			e1.printStackTrace();
			logger.error("Error in historycal timecost struct csv creation: " + e1);
		}
		return "csv/" + name;	//ba
	}
	
	private int getTotalOccupiedSlots(VehicleSlot sc){
		int tot = 0;
		int occupiedCarSharingSlots = (sc.getCarSharingSlotOccupied() != null) ? sc.getCarSharingSlotOccupied() : 0;
		int occupiedFreeSlots = (sc.getFreeParkSlotOccupied() != null) ? sc.getFreeParkSlotOccupied() : 0;
		int occupiedFreeSlotsSigned = (sc.getFreeParkSlotSignOccupied() != null) ? sc.getFreeParkSlotSignOccupied() : 0;
		int occupiedPayingSlots = (sc.getPaidSlotOccupied() != null) ? sc.getPaidSlotOccupied() : 0;
		int occupiedTimedSlots = (sc.getTimedParkSlotOccupied() != null) ? sc.getTimedParkSlotOccupied() : 0;
		int occupiedHandicappedSlots = (sc.getHandicappedSlotOccupied() != null) ? sc.getHandicappedSlotOccupied() : 0;
		int occupiedReservedSlots = (sc.getReservedSlotOccupied() != null) ? sc.getReservedSlotOccupied() : 0;
		int occupiedPinkSlots = (sc.getPinkSlotOccupied() != null) ? sc.getPinkSlotOccupied() : 0;
		int occupiedRechargeableSlots = (sc.getRechargeableSlotOccupied() != null) ? sc.getRechargeableSlotOccupied() : 0;
		int occupiedLoadingUnloadingSlots = (sc.getLoadingUnloadingSlotOccupied() != null) ? sc.getLoadingUnloadingSlotOccupied() : 0;
		tot = occupiedCarSharingSlots + occupiedFreeSlots + occupiedFreeSlotsSigned + occupiedPayingSlots + occupiedTimedSlots + occupiedHandicappedSlots + occupiedReservedSlots + occupiedPinkSlots + occupiedRechargeableSlots + occupiedLoadingUnloadingSlots;
		return tot;
	}
	
	private String correctValue(Map<String, Object> value) {
		StringBuilder sb = new StringBuilder();
		
		String vehicleType = "Automobile";
    	if (value.containsKey("vehicleType")) {
			String vehicleTmp = (String)value.get("vehicleType");
    		vehicleType = (vehicleTmp.compareTo("Car") == 0) ? "Automobile" : "Moto";
		}
    	sb.append(vehicleType);
    	for (String field: valueFields) {
    		String val = value.getOrDefault(field, "0").toString();
    		sb.append(CSV_SEPARATOR + val);
    	}
    	
    	return sb.toString();
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
	public String cleanCommaValue(String data) {
		String cleanedVal = data;
		if (data.contains(",")) {
			cleanedVal = data.replaceAll(",", ".");
		}
		if (cleanedVal.contains(";")) {
			cleanedVal = cleanedVal.replaceAll(";", "-");
		}
		// part for accented chars
		if(cleanedVal.contains("à")){
			cleanedVal = cleanedVal.replaceAll("à", "a'");
		}
		if(cleanedVal.contains("è")){
			cleanedVal = cleanedVal.replaceAll("è", "e'");
		}
		if(cleanedVal.contains("ì")){
			cleanedVal = cleanedVal.replaceAll("ì", "i'");
		}
		if(cleanedVal.contains("ò")){
			cleanedVal = cleanedVal.replaceAll("ò", "o'");
		}
		if(cleanedVal.contains("ù")){
			cleanedVal = cleanedVal.replaceAll("ù", "u'");
		}
		return cleanedVal;
	}

}
