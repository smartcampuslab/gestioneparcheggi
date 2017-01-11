rm -rf WEB-INF
unzip parking.management-2.0.war WEB-INF/classes/static/*
mv WEB-INF/classes/static static
rm -rf WEB-INF
rm -rf tmp
mkdir -p tmp/csv