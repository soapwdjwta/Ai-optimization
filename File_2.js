{-# LANGUAGE OverloadedStrings #-}

module Main where

import Web.Scotty
import Control.Monad.IO.Class (liftIO)
import Database.MongoDB
import Data.Bson.Generic (FromBSON, toBSON)
import Data.Text.Lazy (Text, pack)

data News = News
  { title :: Text
  , description :: Text
  , published :: Text
  } deriving (Show, FromBSON)

getNews :: IO [News]
getNews = do
  pipe <- connect (host "127.0.0.1")
  res <- access pipe master "news" fetchNews
  close pipe
  return res

fetchNews :: ActionM [News]
fetchNews = do
  let query = select [] "news"
  docs <- liftIO $ runDBAction query
  return $ map (\doc -> fromBSON doc :: News) docs

renderNews :: News -> ActionM ()
renderNews n = do
  html $ "<h2>" <> title n <> "</h2><p>" <> description n <> "</p><p>Published: " <> published n <> "</p>"

main :: IO ()
main = do
  news <- getNews
  scotty 3000 $ do
    get "/" $ do
      html "<h1>Welcome to the AI News Portal</h1>"

    get "/news" $ do
      html $ "<h1>Latest AI News</h1>" <> mconcat (map renderNews news)

runDBAction :: Action IO a -> IO a
runDBAction action = do
  pipe <- connect (host "127.0.0.1")
  res <- access pipe master "news" action
  close pipe
  return res
