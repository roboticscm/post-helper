CREATE OR REPLACE FUNCTION get_posts(_username TEXT, _password TEXT)
RETURNS TABLE(id BIGINT, title TEXT, description TEXT, "productTypeId" BIGINT, "productCateId" BIGINT,
	"cityId" BIGINT,  "districtId" BIGINT, "wardId" BIGINT, street TEXT, "projectId" BIGINT, area DOUBLE PRECISION,
	price DOUBLE PRECISION, "unitId" BIGINT, facade DOUBLE PRECISION, "frontLine" DOUBLE PRECISION, "mainDoorDirectionId" BIGINT,
	"balconyDirectionId" BIGINT, "noFloors" BIGINT, "noBedrooms" BIGINT, "noToilets" BIGINT, "newTypeId" BIGINT,
	"startDate" BIGINT, "endDate" BIGINT) AS $$
DECLARE 
	_query TEXT;
BEGIN
	_query = format('
		SELECT id, title, description, product_type_id, product_cate_id,
			city_id, district_id, ward_id, street, project_id, area,
			price, unit_id, facade, front_line, main_door_direction_id,
			balcony_direction_id, no_floors, no_bedrooms, no_toilets, news_type_id,
			start_date, end_date
		FROM post
		WHERE disabled = FALSE
			AND created_by IN (
				SELECT id 
				FROM account
				WHERE username = %L
					AND password = %L
					AND disabled = FALSE
			)
	', _username, _password);
	RETURN QUERY EXECUTE _query;
END;
$$ LANGUAGE PLPGSQL CALLED ON NULL INPUT;





CREATE OR REPLACE FUNCTION get_sites(_username TEXT, _password TEXT)
RETURNS TABLE(name TEXT, url TEXT, username TEXT, password TEXT) AS $$
DECLARE 
	_query TEXT;
BEGIN
	_query = format('
		SELECT DISTINCT s.name, s.url, sa.username, sa.password
		FROM site s
		INNER JOIN site_account sa ON sa.site_id = s.id
			AND sa.username IS NOT NULL
			AND sa.account_id IN (
				SELECT ID
				FROM account
				WHERE disabled = FALSE 
					AND username = %L
					AND password = %L
			)
	', _username, _password);
	RETURN QUERY EXECUTE _query;
END;
$$ LANGUAGE PLPGSQL CALLED ON NULL INPUT;