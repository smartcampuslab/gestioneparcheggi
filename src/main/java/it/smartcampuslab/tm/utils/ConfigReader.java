package it.smartcampuslab.tm.utils;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class ConfigReader {

	private static final String SEPARATOR = ",";
	private static final String COMMENT_CHAR = "#";

	private List<String[]> confs = new ArrayList<String[]>();

	public ConfigReader(File confFile) throws FileNotFoundException,
			IOException {
		readFile(new FileInputStream(confFile));
	}

	public ConfigReader(InputStream fis) throws IOException {
		readFile(fis);
	}

	private void readFile(InputStream fis) throws IOException {
		BufferedInputStream bis = new BufferedInputStream(fis);
		BufferedReader breader = new BufferedReader(new InputStreamReader(fis));
		String line = null;
		while ((line = breader.readLine()) != null) {
			if (!escaping(line)) {
				String[] conf = line.split(SEPARATOR);
				confs.add(conf);
			}
		}

		breader.close();
		bis.close();

	}

	private boolean escaping(String line) {
		try {
			line = line.trim();
			return line.length() == 0 || line.startsWith(COMMENT_CHAR);
		} catch (NullPointerException e) {
			return false;
		}
	}

	public List<String[]> getConfigurations() {
		return confs;
	}

	public List<String[]> getConfiguration(int position, String value) {
		List<String[]> result = new ArrayList<String[]>();
		for (String[] conf : confs) {
			if (conf[position].equals(value)) {
				result.add(conf);
			}
		}
		return result;
	}

}
