## SDk

### Ephemeris

### Conjunctions

## API

## Quality

[Tests](api/jpl/test/README.md)

## Resources

### JPL Body IDs
https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/FORTRAN/req/naif_ids.html

### JPL Kernels
This reposotory contains various kernels required for all computations.

https://naif.jpl.nasa.gov/pub/naif/generic_kernels

### WebGeocalc
This site allows to compute states of solar system objects using SPK kernels.

https://wgc.jpl.nasa.gov:8443/webgeocalc/#StateVector

### JPL Horizons

https://ssd.jpl.nasa.gov/horizons/app.html#/

## Tools

### List SPK file content

Lists content of the SPK file provided as an argument.

```
Usage: ListSpkFileContent <fileName>

Arguments:
  fileName    SPK file name
```

Example:
```
npm run listSpkFileContent -- D:\Workspace\Java\Albedo\misc\jpl-kernels\de440s.bsp
```

### Print Records From SPK File

Reads and prints records from SPK file that meet provided criteria.

```
Usage: PrintRecordsFromSpkFile <fileName>

Arguments:
  fileName             SPK file name

Options:
  --body <body>        Body name - must parse to JPL Body Id
  --centerBody <body>  Center body name - must parse to JPL Body Id
  --from <date>        Start date to cover, yyyy-mm-dd
  --to <date>          End date to cover
```

Example:
```
npm run printRecordsFromSpkFile -- d:/Workspace/Java/Albedo/misc/jpl-kernels/de440s.bsp --body 'Earth Moon Barycenter' --centerBody 'Solar System Barycenter' --from 2022-01-01 --to 2022-01-10
```