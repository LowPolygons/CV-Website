rm -rf .wrangler .output 

npx wrangler d1 execute race_and_times --local --file=database/schema.sql

npx wrangler d1 execute race_and_times --local --command="
INSERT INTO Races (name, description, approved, image_url) VALUES
('Backroads', 'A difficult race through the Los Santos Vinyard. Best suited to vehicles with high acceleration and high downforce. Be prepared to get some scrapes for an optimal time', TRUE, 'https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg'),
('Benchmarker', 'A high speed race through the suburbs. Be careful to dodge all of the destructable objects to get an optimal time!', TRUE, '/question_mark.png'),
('Benchmarker V2', 'A new variation of the benchmarker race, still in the suburbs, exploring new roads. Be weary of depressions on the road, it will damage your time', TRUE, '/question_mark.png'),
('Loop around Yourself', 'A challenging race through the wealthier sections of east los santos. You start at the business center and end at the business center. Ensure you have a lot of downforce for the final bend!', TRUE, '/question_mark.png'),
('Desert J-Bag', 'This race is set in the northern portion of Sandy shores. It features plenty of dirt and track, with some dangerous motorway maneuvores. Ensure you have good acceleration control for an optimal time', TRUE, '/uploads/Desert J-Bag/UkriInfinite.png'),
('Beverly Roads', 'A race set in the berverly hills, starting and finishing in a grand culdesack. For an optimal time, be confident in your ability to handbrake turn', TRUE, '/uploads/8e2b8064b5ed21a9e738346eb0320eee/testImage.png');
"

npx nuxi build --preset=cloudflare_module