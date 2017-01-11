unzip target\parking.management-2.0.war WEB-INF\classes\static\*
move WEB-INF\classes\static static
rd /S /Q WEB-INF
rd /S /Q tmp
mkdir tmp\csv