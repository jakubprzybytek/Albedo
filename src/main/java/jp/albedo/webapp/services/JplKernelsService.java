package jp.albedo.webapp.services;

import jp.albedo.jpl.files.AsciiFileLoader;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.SPKernel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
public class JplKernelsService {

    @Value("${de438.headerFileName}")
    private String de438HeaderFileName;

    @Value("${de438.fileName}")
    private String de438FileName;

    private SPKernel spKernel;

    private synchronized SPKernel loadSPKernel() throws IOException, JplException {

        if (this.spKernel != null) {
            return this.spKernel;
        }

        AsciiFileLoader asciiFileLoader = new AsciiFileLoader();
        asciiFileLoader.loadHeader(new File(this.de438HeaderFileName));
        asciiFileLoader.load(new File(this.de438FileName));

        return asciiFileLoader.createSpKernel();
    }

    public SPKernel getSpKernel() throws IOException, JplException {
        if (this.spKernel == null) {
            this.spKernel = loadSPKernel();
        }

        return spKernel;
    }

}
