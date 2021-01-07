

CREATE OR REPLACE FUNCTION get_posts(_site TEXT, _username TEXT, _password TEXT)
RETURNS TABLE(id BIGINT, title TEXT, description TEXT, "productTypeId" BIGINT, "productCateId" BIGINT,
	city TEXT,  district TEXT, ward TEXT, street TEXT, "projectId" BIGINT, area DOUBLE PRECISION,
	price DOUBLE PRECISION, "unitId" BIGINT, facade DOUBLE PRECISION, "frontLine" DOUBLE PRECISION, "mainDoorDirectionId" BIGINT,
	"balconyDirectionId" BIGINT, "noFloors" BIGINT, "noBedrooms" BIGINT, "noToilets" BIGINT,
	legality TEXT, "newsTypeId" BIGINT, "startDate" BIGINT, "endDate" BIGINT) AS $$
DECLARE 
	_query TEXT;
BEGIN
	_query = format('
		SELECT p.id, title, description, pt.' || _site || '_id, pc.' || _site || '_id,
			ct.name, dt.name, w.name, street, pj.' || _site || '_id, area,
			price, u.' || _site ||'_id, facade, front_line, mdd.' || _site || '_id,
			bd.' || _site || '_id, no_floors, no_bedrooms, no_toilets, legality, nt.' || _site || '_id,
			start_date, end_date
		FROM post p
		LEFT JOIN product_type pt ON pt.id = p.product_type_id
		LEFT JOIN product_cate pc ON pc.id = p.product_cate_id
		LEFT JOIN city ct ON ct.id = p.city_id
		LEFT JOIN district dt ON dt.id = p.district_id
		LEFT JOIN ward w ON w.id = p.ward_id
		LEFT JOIN project pj ON pj.id = p.project_id
		LEFT JOIN unit u ON u.id = p.unit_id
		LEFT JOIN direction mdd ON mdd.id = p.main_door_direction_id
		LEFT JOIN direction bd ON bd.id = p.balcony_direction_id
		LEFT JOIN news_type nt ON nt.id = p.news_type_id
		WHERE p.disabled = FALSE
			AND p.created_by IN (
				SELECT id 
				FROM account
				WHERE username = %L
					AND password = %L
					AND disabled = FALSE
			)
		ORDER BY p.id
	', _username, _password);
	RETURN QUERY EXECUTE _query;
END;
$$ LANGUAGE PLPGSQL CALLED ON NULL INPUT;





CREATE OR REPLACE FUNCTION get_sites(_username TEXT, _password TEXT, _auto_close BOOL)
RETURNS TABLE(name TEXT, url TEXT, username TEXT, password TEXT) AS $$
DECLARE 
	_query TEXT;
BEGIN
	_query = format('
		SELECT DISTINCT s.name, s.url, sa.username, sa.password
		FROM site s
		INNER JOIN site_account sa ON sa.site_id = s.id
			AND sa.username IS NOT NULL
			AND sa.auto_close = %L
			AND sa.account_id IN (
				SELECT ID
				FROM account
				WHERE disabled = FALSE 
					AND username = %L
					AND password = %L
			)
		ORDER BY s.name
	', _auto_close, _username, _password);
	RETURN QUERY EXECUTE _query;
END;
$$ LANGUAGE PLPGSQL CALLED ON NULL INPUT;