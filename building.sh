rm -rf .wrangler .output 

npx wrangler d1 execute race_and_times --local --file=database/schema.sql

npx wrangler d1 execute race_and_times --local --command="
INSERT INTO Races (name, description, approved, image_url) VALUES
('Backroads', 'A difficult race through the Los Santos Vinyard. Best suited to vehicles with high acceleration and high downforce. Be prepared to get some scrapes for an optimal time', TRUE, '/question_mark.png'),
('Benchmarker', 'A high speed race through the suburbs. Be careful to dodge all of the destructable objects to get an optimal time!', TRUE, '/question_mark.png'),
('Benchmarker V2', 'A new variation of the benchmarker race, still in the suburbs, exploring new roads. Be weary of depressions on the road, it will damage your time', TRUE, '/question_mark.png')
"

npx nuxi build --preset=cloudflare_module