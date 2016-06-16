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

import it.smartcommunitylab.parking.management.web.exception.ExportException;
import it.smartcommunitylab.parking.management.web.model.RateArea;
import it.smartcommunitylab.parking.management.web.model.ParkingStructure;
import it.smartcommunitylab.parking.management.web.model.ParkingMeter;
import it.smartcommunitylab.parking.management.web.model.BikePoint;
import it.smartcommunitylab.parking.management.web.model.Street;
import it.smartcommunitylab.parking.management.web.model.Zone;
import it.smartcommunitylab.parking.management.web.model.ParkingStructure.PaymentMode;
import it.smartcommunitylab.parking.management.web.model.geo.Geom;
import it.smartcommunitylab.parking.management.web.model.geo.Line;
import it.smartcommunitylab.parking.management.web.model.geo.Point;
import it.smartcommunitylab.parking.management.web.model.geo.Polygon;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.DecimalFormat;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.data.mongodb.core.MongoTemplate;

public class ZipCsvExporter implements Exporter {

	private static final String CSV_SEPARATOR = ",";
	MongoTemplate db;

	public ZipCsvExporter(MongoTemplate mongoTemplate) {
		db = mongoTemplate;
	}

	public byte[] export() throws ExportException {

		ByteArrayOutputStream bout = new ByteArrayOutputStream();
		try {
			ZipEntry entry = new ZipEntry("aree.csv");
			ZipOutputStream zout = new ZipOutputStream(bout);
			zout.putNextEntry(entry);
			zout.write(getAreeCsv().getBytes());
			zout.closeEntry();

			entry = new ZipEntry("vie.csv");
			zout.putNextEntry(entry);
			zout.write(getVieCsv().getBytes());
			zout.closeEntry();

			entry = new ZipEntry("parcometri.csv");
			zout.putNextEntry(entry);
			zout.write(getParcometriCsv().getBytes());
			zout.closeEntry();

			entry = new ZipEntry("zone.csv");
			zout.putNextEntry(entry);
			zout.write(getZoneCsv().getBytes());
			zout.closeEntry();

			entry = new ZipEntry("puntobici.csv");
			zout.putNextEntry(entry);
			zout.write(getPuntobiciCsv().getBytes());
			zout.closeEntry();

			entry = new ZipEntry("parcheggistruttura.csv");
			zout.putNextEntry(entry);
			zout.write(getParcheggiostrutturaCsv().getBytes());
			zout.closeEntry();

			zout.close();
		} catch (IOException e) {
			throw new ExportException(e.getMessage());
		}
		return bout.toByteArray();

	}

	private String getVieCsv() {
		List<RateArea> areaList = db.findAll(RateArea.class);
		String result = "AREA_APPARTENENZA,STRADA_RIFERIMENTO, NUMERO_POSTI,NUMERO_POSTI_DISABILI,NUMERO_POSTI_DISCO_ORARIO,NUMERO_POSTI_SOSTA_LIBERA,PARCHEGGIO_PER_ABBONATI,GEOMETRIA\n";
		for (RateArea area : areaList) {
			if (area.getStreets() != null) {
				for (Street via : area.getStreets()) {
					result += "\"" + area.getName() + "\"" + CSV_SEPARATOR
							+ "\"" + via.getStreetReference() + "\""
							+ CSV_SEPARATOR + via.getSlotNumber()
							+ CSV_SEPARATOR + via.getHandicappedSlotNumber()
							+ CSV_SEPARATOR + via.getTimedParkSlotNumber()
							+ CSV_SEPARATOR + via.getFreeParkSlotNumber()
							+ CSV_SEPARATOR + via.isSubscritionAllowedPark()
							+ CSV_SEPARATOR + geoToCsv(via.getGeometry())
							+ "\n";
				}
			}
		}

		return result;
	}

	public String getZoneCsv() {
		String result = "NOME,NOTE,COLORE,GEOMETRIA\n";
		List<Zone> zonaList = db.findAll(Zone.class);
		for (Zone zona : zonaList) {
			result += "\"" + zona.getName() + "\"" + CSV_SEPARATOR + "\""
					+ zona.getNote() + "\"" + CSV_SEPARATOR + "#"
					+ zona.getColor() + CSV_SEPARATOR
					+ geoToCsv(zona.getGeometry()) + "\n";
		}
		return result;
	}

	private String getParcheggiostrutturaCsv() {
		List<ParkingStructure> list = db.findAll(ParkingStructure.class);
		String result = "NOME,INDIRIZZO,GESTIONE,CAPIENZA,ORARI,PAGAMENTO,TELEFONO,TARIFFE,GEOMETRIA\n";
		for (ParkingStructure element : list) {
			result += "\"" + element.getName() + "\"" + CSV_SEPARATOR + "\""
					+ element.getStreetReference() + "\"" + CSV_SEPARATOR
					+ "\"" + element.getManagementMode() + "\"" + CSV_SEPARATOR
					+ "\"" + element.getSlotNumber() + "\"" + CSV_SEPARATOR;
					//+ "\"" + element.getTimeSlot() + "\"" + CSV_SEPARATOR;
			result += "\"";
			for (PaymentMode p : element.getPaymentMode()) {
				result += p + " ";
			}
			result += "\"" + CSV_SEPARATOR;
			result += "\"" + element.getPhoneNumber() + "\"" + CSV_SEPARATOR
					//+ "\"" + element.getFee_val() + "\"" + CSV_SEPARATOR
					+ geoToCsv(element.getGeometry()) + "\n";
		}
		return result;
	}

	private String getPuntobiciCsv() {
		List<BikePoint> biciList = db.findAll(BikePoint.class);
		String result = "NOME,NUMERO_BICI,NUMERO_STALLI,GEOMETRIA\n";
		for (BikePoint bici : biciList) {
			result += "\"" + bici.getName() + "\"" + CSV_SEPARATOR
					+ bici.getBikeNumber() + CSV_SEPARATOR
					+ bici.getSlotNumber() + CSV_SEPARATOR
					+ geoToCsv(bici.getGeometry()) + "\n";
		}
		return result;
	}

	private String getParcometriCsv() {
		List<RateArea> areaList = db.findAll(RateArea.class);
		String result = "AREA_APPARTENZA,CODICE,NOTE,STATO,GEOMETRIA\n";
		for (RateArea area : areaList) {
			if (area.getParkingMeters() != null) {
				for (ParkingMeter p : area.getParkingMeters()) {
					result += "\"" + area.getName() + "\"" + CSV_SEPARATOR
							+ "\"" + p.getCode() + "\"" + CSV_SEPARATOR + "\""
							+ p.getNote() + "\"" + CSV_SEPARATOR + "\""
							+ p.getStatus() + "\"" + CSV_SEPARATOR
							+ geoToCsv(p.getGeometry()) + "\n";
				}
			}
		}
		return result;
	}

	private String geoToCsv(Geom geometry) {
		String result = null;
		if (geometry instanceof Point) {
			Point p = (Point) geometry;
			result = "POINT(" + p.getLat() + " " + p.getLng() + ")";
		} else if (geometry instanceof Line) {
			Line l = (Line) geometry;
			result = "LINESTRING(";
			for (Point p : l.getPoints()) {
				result += p.getLat() + " " + p.getLng() + " ";
			}
			result += ")";
		} else if (geometry instanceof Polygon) {
			Polygon p = (Polygon) geometry;
			result = "POLYGON((";
			for (Point pp : p.getPoints()) {
				result += pp.getLat() + " " + pp.getLng() + " ";
			}
			result += "))";
		}

		return result;
	}

	private String getAreeCsv() {
		List<RateArea> areaList = db.findAll(RateArea.class);
		String result = "NOME,COSTO,FASCIE,CODICE_SMS,COLORE\n";
		for (RateArea area : areaList) {
			result += "\"" + area.getName() + "\"" + CSV_SEPARATOR
					/*+ new DecimalFormat("#0.00").format(area.getFee())
					+ CSV_SEPARATOR + "\"" + area.getTimeSlot() + "\""*/
					+ CSV_SEPARATOR + "\"" + area.getSmsCode() + "\""
					+ CSV_SEPARATOR + "\"" + "#" + area.getColor() + "\""
					+ "\n";
		}

		return result;
	}
}
