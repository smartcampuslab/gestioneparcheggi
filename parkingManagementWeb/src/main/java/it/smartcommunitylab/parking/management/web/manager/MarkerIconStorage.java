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

import it.smartcommunitylab.parking.management.web.utils.ConfigReader;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;

public class MarkerIconStorage {

	private static final Logger logger = Logger.getLogger(MarkerIconStorage.class);
	
	private static final String ICON_FOLDER = "imgs/markerIcons/";
	private static final String TEMPLATE_FILE = "defaultTemplate.png";
	private static final String TEMPLATE_PREFIX = "template_";
	private static final String TEMPLATE_EXT = ".png";
	private static final String CONFIG_FILE = "icons.config";

	private static Map<String, Color> templateSampleColor = new HashMap<String, Color>();

	private static final int COLOR_RECT_HEIGHT = 5;
	private static final int ICON_INCR_HEIGHT = 6;

	public static final String ICON_CONTENT_TYPE = "image/png";
	private static final String ICON_TYPE = "PNG";
	private static final String ICON_EXTENSION = ".png";

	private static final String ICON_FOLDER_CACHE = "cache";
	// not used a subdirectory for templates
	private static final String ICON_FOLDER_TEMPLATE = "";
	private ConfigReader configReader;

	/**
	 * TEMPLATES SAMPLE COLORS
	 */
	private static final Color DEFAULT_TEMPLATE_SAMPLE_COLOR = new Color(
			Integer.parseInt("e81e25", 16));
	private static final Color PARCOMETRO_TEMPLATE_SAMPLE_COLOR = new Color(
			Integer.parseInt("000000", 16));

	public MarkerIconStorage() throws IOException {
		configReader = new ConfigReader(getClass().getResourceAsStream(
				"/" + CONFIG_FILE));

		// template icons sample colors
		// templateSampleColor.put("parcometro",
		// new Color(Integer.parseInt("e81e25", 16)));
		templateSampleColor.put("parcometro", PARCOMETRO_TEMPLATE_SAMPLE_COLOR);

	}

	public byte[] getMarkerIcon(String basePath, String company, String entity,
			String color) throws IOException {
		//logger.info(String.format("In getMarkerIcon: %s, %s, %s", company, entity, color));
		if (color == null) {
			return getTemplateMarker(basePath, company, entity);
		}
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

	private byte[] getTemplateMarker(String basePath, String company,
			String entity) throws IOException {
		String filename = getIconFolder(basePath, ICON_FOLDER_TEMPLATE);
		List<String> markerDetails = getMarkerIconDetails(company, entity);
		if (markerDetails == null) {
			String templateIcon = TEMPLATE_PREFIX + entity + TEMPLATE_EXT;
			if (!new File(filename + templateIcon).exists()) {
				filename += TEMPLATE_FILE;
			} else {
				filename += templateIcon;
			}
		} else {
			filename += markerDetails.get(0);
		}

		return FileUtils.readFileToByteArray(new File(filename));
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
		File iconFolder = new File(basePath + ICON_FOLDER + type);
		if (!iconFolder.exists()) {
			iconFolder.mkdirs();
		}

		return iconFolder.getAbsolutePath() + "/";
	}

	@SuppressWarnings("unused")
	private void generateMarkerWithFlag(String basePath, String company,
			String entity, String color) throws IOException {
		BufferedImage templateIcon = ImageIO.read(new File(getIconFolder(
				basePath, ICON_FOLDER) + TEMPLATE_FILE));
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
		//logger.info(String.format("In generateColoredMarker: %s, %s, %s, %s", basePath, company, entity, color));
		List<String> markerDetails = getMarkerIconDetails(company, entity);
		String markerIcon = TEMPLATE_FILE;
		Color colorSample = DEFAULT_TEMPLATE_SAMPLE_COLOR;
		//logger.info(String.format("Sample color: %s, (%s, %s, %s)", colorSample.getRGB(), colorSample.getRed(), colorSample.getGreen(), colorSample.getBlue()));
		if (new File(basePath + ICON_FOLDER + TEMPLATE_PREFIX + entity
				+ TEMPLATE_EXT).exists()) {
			markerIcon = TEMPLATE_PREFIX + entity + TEMPLATE_EXT;
			colorSample = templateSampleColor.get(entity);
			if (colorSample == null) {
				colorSample = DEFAULT_TEMPLATE_SAMPLE_COLOR;
			}
			//logger.info(String.format("Sample color: %s, (%s, %s, %s)", colorSample.getRGB(), colorSample.getRed(), colorSample.getGreen(), colorSample.getBlue()));
		}
		if (markerDetails != null) {
			markerIcon = markerDetails.get(0);
			colorSample = new Color(Integer.parseInt(markerDetails.get(1), 16));
		}
		//logger.info(String.format("Sample color: %s, (%s, %s, %s)", colorSample.getRGB(), colorSample.getRed(), colorSample.getGreen(), colorSample.getBlue()));
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
		//logger.info(String.format("In changeColor: %s, %s, %s", image, mask, replacement));
		BufferedImage destImage = new BufferedImage(image.getWidth(),
				image.getHeight(), BufferedImage.TYPE_INT_ARGB);

		Graphics2D g = destImage.createGraphics();
		g.drawImage(image, null, 0, 0);
		g.dispose();

		for (int i = 0; i < destImage.getWidth(); i++) {
			for (int j = 0; j < destImage.getHeight(); j++) {

				int destRGB = destImage.getRGB(i, j);
				
				//logger.info(String.format("mask rgb: %d, dest rgb: %d", mask.getRGB(), destRGB));

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
		//logger.info(String.format("getNewPixelRGB: %d, %d", replacement, destRGB));

		int rgbnew = Color.HSBtoRGB(replHSB[HUE], replHSB[SATURATION],
				destHSB[BRIGHTNESS]);
		return rgbnew;
	}

	private static boolean matches(int maskRGB, int destRGB) {
		float[] hsbMask = getHSBArray(maskRGB);
		float[] hsbDest = getHSBArray(destRGB);
		//logger.info(String.format("hsbMask: %s, hsbDest: %s", hsbMask, hsbDest));
		
		if (hsbMask[HUE] == hsbDest[HUE]
				&& hsbMask[SATURATION] == hsbDest[SATURATION]
				&& hsbMask[BRIGHTNESS] == hsbDest[BRIGHTNESS]	//nb: remove to have an icon with best bordes
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
