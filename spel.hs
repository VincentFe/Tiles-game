module Template where

type Coordinate = (Int, Int)

data Board = Board Int Int [Coordinate] [Coordinate]

myLine :: Board -> Coordinate -> String
myLine (Board maxX maxY otiles xtiles) (x,y) =
  if x < maxX 
    then if elem (x,y) otiles
           then "O " ++ myLine (Board maxX maxY otiles xtiles) ((x+1),y)
         else if elem (x,y) xtiles
            then "X " ++ myLine (Board maxX maxY otiles xtiles) ((x+1),y)
         else ". " ++ myLine (Board maxX maxY otiles xtiles) ((x+1),y)
  else ""


printBoard :: Board -> Int -> [String]
printBoard (Board maxX maxY otiles xtiles) lineheight =
  if lineheight < maxY
    then (myLine (Board maxX maxY otiles xtiles) (0,lineheight) : printBoard (Board maxX maxY otiles xtiles) (lineheight + 1))
  else []

spaces :: Int -> String
spaces 0 = ""
spaces i = " " ++ spaces (i-1)

myShift :: [String] -> Int -> String
myShift [] _ = ""
myShift (x:xs) i = (spaces i) ++ x ++ "\n" ++ myShift xs (i+1)

instance Show Board where
  show b = myShift (printBoard b 0) 0

myFlip :: [Coordinate] -> [Coordinate]
myFlip [] = []
myFlip ((x,y):zs) = (y,x) : myFlip zs

myfilter :: [Coordinate] -> [Coordinate] -> [Coordinate]
myfilter _ [] = []
myfilter l (x:xs) = 
  if elem x l
    then myfilter l xs
  else x : myfilter l xs

startCoordinates :: String -> [Coordinate] -> [Coordinate]
startCoordinates _ [] = []
startCoordinates "O" ((y,0):ls) = (y,0) : startCoordinates "O" ls
startCoordinates "O" (x:xs) = startCoordinates "O" xs
startCoordinates "X" ((0,y):ls) = (0,y) : startCoordinates "X" ls
startCoordinates "X" (x:xs) = startCoordinates "X" xs

searchDown :: Coordinate -> [Coordinate] -> [Coordinate] -> Bool
searchDown _ [] _ = False
searchDown (maxX,maxY) ((x,y):zs) tiles = 
  if x > maxX || y > maxY || x < 0 || y < 0 
    then False
  else if y == maxY && (elem (x,y) tiles)
    then True
  else if not (elem (x,y) tiles)
    then False
  else if (searchDown (maxX,maxY) ((x-1,y):zs) newTiles) || (searchDown (maxX,maxY) ((x+1,y):zs) newTiles) || (searchDown (maxX,maxY) ((x,y+1):zs) newTiles)
    then True
  else searchDown (maxX,maxY) zs tiles
  where
    newTiles = myfilter [(x,y)] tiles


searchRight :: Coordinate -> [Coordinate] -> [Coordinate] -> Bool
searchRight _ [] _ = False
searchRight (maxX,maxY) ((x,y):zs) tiles = 
  if x > maxX || y > maxY || x < 0 || y < 0
    then False
  else if x == maxX && (elem (x,y) tiles)
    then True
  else if not (elem (x,y) tiles)
    then False
  else (searchRight (maxX,maxY) ((x,y-1):zs) newTiles) || (searchRight (maxX,maxY) ((x,y+1):zs) newTiles) || (searchRight (maxX,maxY) ((x+1,y):zs) newTiles)
  where
    newTiles = myfilter [(x,y)] tiles

routeDown :: Coordinate -> [Coordinate] -> Bool
routeDown c tiles = 
  if length start == 0
    then False
  else
    searchDown c start tiles
  where 
    start = startCoordinates "O" tiles

routeRight :: Coordinate -> [Coordinate] -> Bool
routeRight c tiles = 
  if length start == 0 
    then False
  else
    searchRight c start tiles
  where 
    start = startCoordinates "X" tiles

win :: Board -> Bool
win (Board maxX maxY otiles xtiles) = 
  routeDown newC otiles || routeRight newC xtiles
  where
    newC = (maxX-1,maxY-1)

filledIn :: Coordinate -> [Coordinate] -> [Coordinate] -> Bool
filledIn _ [] [] = False
filledIn p [] (x:xs) = 
  if (p == x)
    then True
  else filledIn p [] xs
filledIn p (x:xs) [] = 
  if (p == x)
    then True
  else filledIn p xs []
filledIn p (x:xs) (y:ys) = 
  if (p == x) || (p == y)
    then True
  else filledIn p xs ys


fullBoard :: [Coordinate] -> [Coordinate] -> [Coordinate] -> Bool
fullBoard _ _ [] = True
fullBoard otiles xtiles (x:xs) = 
  if elem x otiles || elem x xtiles
    then fullBoard otiles xtiles xs
  else 
    False


allCoordinates :: Int -> Int -> [Coordinate]
allCoordinates xs ys = [ (x,y) | x <- [0..(xs-1)], y <- [0..(ys-1)] ]

invalidInput :: Coordinate -> Coordinate -> Bool
invalidInput (x,y) (maxX,maxY) =
  if x >= maxX || y >= maxY || x < 0 || y < 0
    then True
  else
    False

run :: Board -> String -> IO()
run (Board maxX maxY otiles xtiles) "O" = do
  putStrLn (show (Board maxX maxY otiles xtiles))
  x <- putStr "x-coordinate of the O tile: " >> readLn
  y <- putStr "y-coordinate of the O tile: " >> readLn
  if invalidInput (x,y) (maxX,maxY)
    then putStrLn "Invalid input, please try again!" >> run (Board maxX maxY otiles xtiles) "O"
  else if fullBoard otiles xtiles (allCoordinates maxX maxY)
    then putStrLn "The board is full, no more moves possible. Thank you for playing!" 
  else if filledIn (x,y) otiles xtiles
    then putStrLn "Position is filled, try again" >> run (Board maxX maxY otiles xtiles) "O"
  else if win (Board maxX maxY ((x,y):otiles) xtiles)
    then putStrLn (show (Board maxX maxY ((x,y):otiles) xtiles)) >> putStrLn "Congratulation. You won!"
  else run (Board maxX maxY ((x,y):otiles) xtiles) "X"
run (Board maxX maxY otiles xtiles) "X" = do
  putStrLn (show (Board maxX maxY otiles xtiles))
  x <- putStr "x-coordinate of the X tile: " >> readLn
  y <- putStr "y-coordinate of the X tile: " >> readLn
  if invalidInput (x,y) (maxX,maxY)
    then putStrLn "Invalid input, please try again!" >> run (Board maxX maxY otiles xtiles) "X"
  else if fullBoard otiles xtiles (allCoordinates maxX maxY)
    then putStrLn "The board is full, no more moves possible. Thank you for playing!" 
  else if filledIn (x,y) otiles xtiles
    then putStrLn "Position is filled, try again" >> run (Board maxX maxY otiles xtiles) "X"
  else if win (Board maxX maxY otiles ((x,y):xtiles))
    then putStrLn (show (Board maxX maxY otiles ((x,y):xtiles))) >> putStrLn "Congratulation. You won!"
  else run (Board maxX maxY otiles ((x,y):xtiles)) "O"
  

play :: IO()
play = do 
  width <- putStr "What is the width of the board: " >> readLn
  height <- putStr "What is the height of the board: " >> readLn
  start <- putStr "Which player will start? (O plays top-down): " >> getLine
  if (start == "O") || (start == "X")
    then run (Board width height [] []) start
  else putStrLn "Invalid player, please start again" >> play








