package it.smartcommunitylab.parking.management.web.http;

import it.smartcommunitylab.parking.management.web.exception.ExportException;
import it.smartcommunitylab.parking.management.web.manager.StorageManager;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.support.HttpRequestHandlerServlet;

public class ExportServlet extends HttpRequestHandlerServlet {

	private static final long serialVersionUID = 5525402045779409323L;

	@Autowired
	StorageManager storage;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		byte[] data = null;
		try {
			data = storage.exportData();
			resp.setHeader("Content-Disposition",
					"attachment; filename=\"data.zip\"");
			resp.setContentLength(data.length);
			resp.setContentType("application/zip");
			resp.getOutputStream().write(data);
			resp.getOutputStream().flush();
		} catch (ExportException e) {
			resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
					"Problems generation zip archive");
		}
	}

}
