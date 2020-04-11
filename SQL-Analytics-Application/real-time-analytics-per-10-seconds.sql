CREATE STREAM "DESTINATION_SQL_STREAM"
    (arrival_time TIMESTAMP, ip VARCHAR(16), statusCount INTEGER, pos INTEGER, neg INTEGER);

CREATE OR REPLACE PUMP "PUMP_FOR_IP_COUNT" AS
    INSERT INTO "DESTINATION_SQL_STREAM"
    SELECT STREAM 
        (TIMESTAMP '1970-01-01 00:00:00' + 10 * FLOOR((cloudtraillogs.APPROXIMATE_ARRIVAL_TIME - TIMESTAMP '1970-01-01 00:00:00') SECOND / 10 TO SECOND)) AS arrival_time,
        "ip",
        COUNT(*) AS statusCount,
        SUM("positive") as pos,
        SUM("negative") as neg
        FROM "SOURCE_SQL_STREAM_001" cloudtraillogs
    GROUP BY "ip",
        FLOOR((cloudtraillogs.ROWTIME - TIMESTAMP '1970-01-01 00:00:00') SECOND / 10 TO SECOND),
	FLOOR((cloudtraillogs.APPROXIMATE_ARRIVAL_TIME - TIMESTAMP '1970-01-01 00:00:00') SECOND / 10 TO SECOND);
