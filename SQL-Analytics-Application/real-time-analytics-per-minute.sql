CREATE STREAM "DESTINATION_SQL_STREAM"
    (arrival_time TIMESTAMP, ip VARCHAR(16), statusCount INTEGER, pos INTEGER, neg INTEGER);

CREATE OR REPLACE PUMP "PUMP_FOR_IP_COUNT" AS
    INSERT INTO "DESTINATION_SQL_STREAM"
    SELECT STREAM 
        FLOOR(cloudtraillogs.APPROXIMATE_ARRIVAL_TIME TO MINUTE) AS arrival_time,
        "ip",
        COUNT(*) AS statusCount,
        SUM("positive") as pos,
        SUM("negative") as neg
        FROM "SOURCE_SQL_STREAM_001" cloudtraillogs
    GROUP BY "ip",
        FLOOR(cloudtraillogs.ROWTIME TO MINUTE),
		FLOOR(cloudtraillogs.APPROXIMATE_ARRIVAL_TIME TO MINUTE);
