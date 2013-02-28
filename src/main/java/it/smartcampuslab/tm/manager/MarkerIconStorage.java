package it.smartcampuslab.tm.manager;

import it.smartcampuslab.tm.utils.ConfigReader;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import javax.imageio.ImageIO;

import org.apache.commons.io.FileUtils;

public class MarkerIconStorage {

	private static final String ICON_FOLDER = "imgs/markerIcons/";
	private static final String TEMPLATE_FILE = "template.png";
	private static final String CONFIG_FILE = "icons.config";

	private static final Color TEMPLATE_SAMPLE_COLOR = new Color(0, 0, 0);

	private static final int COLOR_RECT_HEIGHT = 5;
	private static final int ICON_INCR_HEIGHT = 6;

	public static final String ICON_CONTENT_TYPE = "image/png";
	private static final String ICON_TYPE = "PNG";
	private static final String ICON_EXTENSION = ".png";

	private static final String ICON_FOLDER_TEMPLATE = "";
	private static final String ICON_FOLDER_CACHE = "cache";

	private ConfigReader configReader;

	public MarkerIconStorage() throws IOException {
		configReader = new ConfigReader(getClass().getResourceAsStream(
				"/" + CONFIG_FILE));
	}

	public byte[] getMarkerIcon(String basePath, String company, String entity,
			String color) throws IOException {
		if (!new File(getIconFolder(basePath, ICON_FOLDER_CACHE) + company
				+ "-" + entity + "-" + color + ICON_EXTENSION).exists()) {
			// load template icon
			generateColoredMarker(basePath, company, entity, color);
		}
		return FileUtils.readFileToByteArray(new File(getIconFolder(basePath,
				ICON_FOLDER_CACHE)
				+ company
				+ "-"
				+ entity
				+ "-"
				+ color
				+ ICON_EXTENSION));
	}

	/**
	 * 
	 * @param company
	 * @param entity
	 * @return a list of two elements: first marker filename, second color to
	 *         change
	 */
	private List<String> getMarkerIconDetails(String company, String entity) {
		for (String[] conf : configReader.getConfiguration(0, company)) {
			if (conf[1].equals(entity)) {
				return Arrays.asList(conf[2], conf[3]);
			}
		}
		return null;
	}

	private static String getIconFolder(String basePath, String type) {
		// check if path ends with '/', otherwise '/' is appended
		if (!basePath.endsWith("/")) {
			basePath += "/";
		}

		// check if iconFolder exists, otherwise folder is created
		File iconFolder = new File(basePath + ICON_FOLDER + "/" + type);
		if (!iconFolder.exists()) {
			iconFolder.mkdirs();
		}

		return iconFolder.getAbsolutePath() + "/";
	}

	private void generateMarkerWithFlag(String basePath, String company,
			String entity, String color) throws IOException {
		BufferedImage templateIcon = ImageIO.read(new File(getIconFolder(
				basePath, ICON_FOLDER_TEMPLATE) + TEMPLATE_FILE));
		BufferedImage icon = new BufferedImage(templateIcon.getWidth(),
				templateIcon.getHeight() + ICON_INCR_HEIGHT,
				BufferedImage.TYPE_INT_ARGB);
		Graphics2D graphics = icon.createGraphics();
		graphics.setColor(new Color(Integer.parseInt(color, 16)));
		graphics.drawRect(0, 0, icon.getWidth(), COLOR_RECT_HEIGHT);
		graphics.fillRect(0, 0, icon.getWidth(), COLOR_RECT_HEIGHT);
		graphics.drawImage(templateIcon, 0, ICON_INCR_HEIGHT, null);
		graphics.dispose();
		ImageIO.write(icon, ICON_TYPE,
				new File(getIconFolder(basePath, ICON_FOLDER_CACHE) + company
						+ "-" + entity + "-" + color + ICON_EXTENSION));
	}

	private void generateColoredMarker(String basePath, String company,
			String entity, String color) throws IOException {
		List<String> markerDetails = getMarkerIconDetails(company, entity);
		String markerIcon = TEMPLATE_FILE;
		Color colorSample = TEMPLATE_SAMPLE_COLOR;
		if (markerDetails != null) {
			markerIcon = markerDetails.get(0);
			colorSample = new Color(Integer.parseInt(markerDetails.get(1), 16));
		}
		BufferedImage templateIcon = ImageIO.read(new File(getIconFolder(
				basePath, ICON_FOLDER_TEMPLATE) + markerIcon));
		BufferedImage coloredMarker = changeColor(templateIcon, colorSample,
				new Color(Integer.parseInt(color, 16)));
		ImageIO.write(coloredMarker, ICON_TYPE,
				new File(getIconFolder(basePath, ICON_FOLDER_CACHE) + company
						+ "-" + entity + "-" + color + ICON_EXTENSION));
	}

	private static final int RED = 1;
	private static final int GREEN = 2;
	private static final int BLUE = 3;

	private static final int HUE = 0;
	private static final int SATURATION = 1;
	private static final int BRIGHTNESS = 2;

	private static final int TRANSPARENT = 0;
	private static final int ALPHA = 0;

	private static BufferedImage changeColor(BufferedImage image, Color mask,
			Color replacement) {
		BufferedImage destImage = new BufferedImage(image.getWidth(),
				image.getHeight(), BufferedImage.TYPE_INT_ARGB);

		Graphics2D g = destImage.createGraphics();
		g.drawImage(image, null, 0, 0);
		g.dispose();

		for (int i = 0; i < destImage.getWidth(); i++) {
			for (int j = 0; j < destImage.getHeight(); j++) {

				int destRGB = destImage.getRGB(i, j);

				if (matches(mask.getRGB(), destRGB)) {
					int rgbnew = getNewPixelRGB(replacement.getRGB(), destRGB);
					destImage.setRGB(i, j, rgbnew);
				}
			}
		}

		return destImage;
	}

	private static int getNewPixelRGB(int replacement, int destRGB) {
		float[] destHSB = getHSBArray(destRGB);
		float[] replHSB = getHSBArray(replacement);

		int rgbnew = Color.HSBtoRGB(replHSB[HUE], replHSB[SATURATION],
				destHSB[BRIGHTNESS]);
		return rgbnew;
	}

	private static boolean matches(int maskRGB, int destRGB) {
		float[] hsbMask = getHSBArray(maskRGB);
		float[] hsbDest = getHSBArray(destRGB);

		if (hsbMask[HUE] == hsbDest[HUE]
				&& hsbMask[SATURATION] == hsbDest[SATURATION]
				&& getRGBArray(destRGB)[ALPHA] != TRANSPARENT) {

			return true;
		}
		return false;
	}

	private static int[] getRGBArray(int rgb) {
		return new int[] { (rgb >> 24) & 0xff, (rgb >> 16) & 0xff,
				(rgb >> 8) & 0xff, rgb & 0xff };
	}

	private static float[] getHSBArray(int rgb) {
		int[] rgbArr = getRGBArray(rgb);
		return Color.RGBtoHSB(rgbArr[RED], rgbArr[GREEN], rgbArr[BLUE], null);
	}

}
