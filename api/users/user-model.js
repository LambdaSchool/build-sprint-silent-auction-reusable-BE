const db = require("../../data/dbconfig");

module.exports = {
  findUser,
  getSellerAuctions,
  getBuyerAuctions,
}

function findUser(username) {
  return db('users')
    .where({username})
    .select('id','username','first_name','last_name','is_seller as role')
    .first();
}

function getSellerAuctions(user_id) {
  return db('auctions')
    .where({user_id})
    .select('id','name','description','starting_price','date_starting', 'date_ending','image')
}

function getBuyerAuctions(user_id) {
    return db('auction_bids')
      .whereRaw(`auction_bids.user_id = ${user_id}`)
      .join('auctions as a', 'auction_bids.auction_id', 'a.id')
      .join('users as u', 'a.user_id', 'u.id')
      .select('a.id as auction_id', 'u.username as sold_by_user', 'u.first_name as sold_by', 'a.name', 'a.description', 'a.date_starting', 'a.date_ending', 'a.image', 'auction_bids.id as bid_id', 'auction_bids.created_at as bid_date')
      .max('auction_bids.price as your_recent_bid')
      .groupBy('auction_bids.auction_id')
}