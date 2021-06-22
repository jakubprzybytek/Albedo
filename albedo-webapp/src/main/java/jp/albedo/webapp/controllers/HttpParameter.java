package jp.albedo.webapp.controllers;

import org.springframework.web.context.request.NativeWebRequest;

public class HttpParameter {

    /**
     * Parses boolean parameter from the request. Returns 'true' if parameter value is 'true', otherwise returns 'false'
     *
     * @param request       Request.
     * @param parameterName Parameter name.
     * @return 'True' if request contains named parameter and its string value is 'true'. 'False' otherwise.
     */
    public static boolean getBoolean(NativeWebRequest request, String parameterName) {
        return Boolean.parseBoolean(request.getParameter(parameterName));
    }

}
