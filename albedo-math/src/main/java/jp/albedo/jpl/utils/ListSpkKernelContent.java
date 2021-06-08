package jp.albedo.jpl.utils;

import jp.albedo.jpl.JplException;
import jp.albedo.jpl.files.binary.SpkFileArrayInformation;
import jp.albedo.jpl.files.binary.SpkFileReader;

import java.io.File;
import java.io.IOException;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.StandardOpenOption;
import java.util.List;

public class ListSpkKernelContent {
    public static void main(String[] args) throws Exception {
        listSpkKernelContent(new File("d:/Workspace/Java/Albedo/misc/de438/de438t.bsp"));
        listSpkKernelContent(new File("d:/Workspace/Java/Albedo/misc/de438/de440.bsp"));
        listSpkKernelContent(new File("d:/Workspace/Java/Albedo/misc/de438/de440s.bsp"));
        listSpkKernelContent(new File("d:/Workspace/Java/Albedo/misc/de438/mar097.bsp"));
        listSpkKernelContent(new File("d:/Workspace/Java/Albedo/misc/de438/jup357.bsp"));
        listSpkKernelContent(new File("d:/Workspace/Java/Albedo/misc/de438/jup365.bsp"));
    }

    static void listSpkKernelContent(File file) throws JplException {
        System.out.printf("File: %s\n", file);

        for (SpkFileArrayInformation arrayInformation : loadArrayInformation(file)) {
            System.out.printf("%s w.r.t %s, from %.1f to %.1f in %s reference frame as %s\n",
                    arrayInformation.getBody(), arrayInformation.getCenterBody(), arrayInformation.getStartDate(), arrayInformation.getEndDate(),
                    arrayInformation.getReferenceFrame(), arrayInformation.getDataType());
        }

        System.out.println("-------------------------------------------------");
    }

    static List<SpkFileArrayInformation> loadArrayInformation(File file) throws JplException {
        try (FileChannel fileChannel = (FileChannel) Files.newByteChannel(file.toPath(), StandardOpenOption.READ)) {

            SpkFileReader reader = new SpkFileReader(fileChannel);
            return reader.getArraysInformation();

        } catch (IOException e) {
            throw new JplException("Cannot read spk file!", e);
        }
    }
}
