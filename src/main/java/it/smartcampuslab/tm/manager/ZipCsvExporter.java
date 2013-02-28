package it.smartcampuslab.tm.manager;

import it.smartcampuslab.tm.exception.ExportException;
import it.smartcampuslab.tm.model.Area;
import it.smartcampuslab.tm.model.Parcometro;
import it.smartcampuslab.tm.model.PuntoBici;
import it.smartcampuslab.tm.model.Via;
import it.smartcampuslab.tm.model.Zona;
import it.smartcampuslab.tm.model.geo.Geom;
import it.smartcampuslab.tm.model.geo.Line;
import it.smartcampuslab.tm.model.geo.Point;
import it.smartcampuslab.tm.model.geo.Polygon;

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

			zout.close();
		} catch (IOException e) {
			throw new ExportException(e.getMessage());
		}
		return bout.toByteArray();

	}

	private String getVieCsv() {
		List<Area> areaList = db.findAll(Area.class);
		String result = "AREA_APPARTENENZA,STRADA_RIFERIMENTO, NUMERO_POSTI,NUMERO_POSTI_DISABILI,GEOMETRIA\n";
		for (Area area : areaList) {
			if (area.getVie() != null) {
				for (Via via : area.getVie()) {
					result += "\"" + area.getName() + "\"" + CSV_SEPARATOR
							+ "\"" + via.getStreetReference() + "\""
							+ CSV_SEPARATOR + via.getSlotNumber()
							+ CSV_SEPARATOR + via.getHandicappedSlotNumber()
							+ CSV_SEPARATOR + geoToCsv(via.getGeometry())
							+ "\n";
				}
			}
		}

		return result;
	}

	public String getZoneCsv() {
		String result = "NOME,NOTE,COLORE,GEOMETRIA\n";
		List<Zona> zonaList = db.findAll(Zona.class);
		for (Zona zona : zonaList) {
			result += "\"" + zona.getName() + "\"" + CSV_SEPARATOR + "\""
					+ zona.getNote() + "\"" + CSV_SEPARATOR + "#"
					+ zona.getColor() + CSV_SEPARATOR
					+ geoToCsv(zona.getGeometry()) + "\n";
		}
		return result;
	}

	private String getPuntobiciCsv() {
		List<PuntoBici> biciList = db.findAll(PuntoBici.class);
		String result = "NOME,NUMERO_BICI,NUMERO_STALLI,GEOMETRIA\n";
		for (PuntoBici bici : biciList) {
			result += "\"" + bici.getName() + "\"" + CSV_SEPARATOR
					+ bici.getBikeNumber() + CSV_SEPARATOR
					+ bici.getSlotNumber() + CSV_SEPARATOR
					+ geoToCsv(bici.getGeometry()) + "\n";
		}
		return result;
	}

	private String getParcometriCsv() {
		List<Area> areaList = db.findAll(Area.class);
		String result = "AREA_APPARTENZA,CODICE,NOTE,STATO,GEOMETRIA\n";
		for (Area area : areaList) {
			if (area.getParcometri() != null) {
				for (Parcometro p : area.getParcometri()) {
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
		List<Area> areaList = db.findAll(Area.class);
		String result = "NOME,COSTO,FASCIE,CODICE_SMS,COLORE\n";
		for (Area area : areaList) {
			result += "\"" + area.getName() + "\"" + CSV_SEPARATOR
					+ new DecimalFormat("#0.00").format(area.getFee())
					+ CSV_SEPARATOR + "\"" + area.getTimeSlot() + "\""
					+ CSV_SEPARATOR + "\"" + area.getSmsCode() + "\""
					+ CSV_SEPARATOR + "\"" + "#" + area.getColor() + "\""
					+ "\n";
		}

		return result;
	}
}
