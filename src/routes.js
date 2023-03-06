const { addBookHandler, getAllBooks, getBookById, editBookById, deleteBookById } = require("./handler");

const routes = [
	{
		path: "/books",
		method: "GET",
		handler: getAllBooks,
	},
	{
		path: "/books",
		method: "POST",
		handler: addBookHandler,
	},
	{
		path: "/books/{bookId}",
		method: "GET",
		handler: getBookById,
	},
	{
		path: "/books/{bookId}",
		method: "PUT",
		handler: editBookById,
	},
	{
		path: "/books/{bookId}",
		method: "DELETE",
		handler: deleteBookById,
	},
];

module.exports = routes;
