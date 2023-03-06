const { nanoid } = require("nanoid");
const allBooks = require("./books");

const addBookHandler = (request, h) => {
	const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

	const id = nanoid(16);
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;
	let finished = false;

	if (!name) {
		const response = h.response({
			status: "fail",
			message: "Gagal menambahkan buku. Mohon isi nama buku",
		});

		response.code(400);
		return response;
	}

	if (readPage > pageCount) {
		const response = h.response({
			status: "fail",
			message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
		});

		response.code(400);
		return response;
	}

	if (pageCount === readPage) {
		finished = true;
	}

	const newBook = {
		id,
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		finished,
		reading,
		insertedAt,
		updatedAt,
	};

	allBooks.push(newBook);

	const isSuccess = allBooks.filter((book) => book.id === id).length > 0;

	if (isSuccess) {
		const response = h.response({
			status: "success",
			message: "Buku berhasil ditambahkan",
			data: {
				bookId: id,
			},
		});

		response.code(201);
		return response;
	}

	const response = h.response({
		status: "fail",
		message: "Buku gagal ditambahkan",
	});

	response.code(500);
	return response;
};

const getAllBooks = (request, h) => {
	const { name, reading, finished } = request.query;

	if (name) {
		const books = allBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())).map(({ id, name, publisher }) => ({ id, name, publisher }));

		const response = h.response({
			status: "success",
			data: { books },
		});

		return response;
	}

	if (reading === "1") {
		const books = allBooks.filter((book) => book.reading === true).map(({ id, name, publisher }) => ({ id, name, publisher }));

		const response = h.response({
			status: "success",
			data: { books },
		});

		return response;
	}

	if (reading === "0") {
		const books = allBooks.filter((book) => book.reading === false).map(({ id, name, publisher }) => ({ id, name, publisher }));

		const response = h.response({
			status: "success",
			data: { books },
		});

		return response;
	}

	if (finished === "1") {
		const books = allBooks.filter((book) => book.finished === true).map(({ id, name, publisher }) => ({ id, name, publisher }));

		const response = h.response({
			status: "success",
			data: { books },
		});

		return response;
	}

	if (finished === "0") {
		const books = allBooks.filter((book) => book.finished === false).map(({ id, name, publisher }) => ({ id, name, publisher }));

		const response = h.response({
			status: "success",
			data: { books },
		});

		return response;
	}

	const books = allBooks.map(({ id, name, publisher }) => ({ id, name, publisher }));

	const response = h.response({
		status: "success",
		data: { books },
	});

	return response;
};

const getBookById = (request, h) => {
	const { bookId } = request.params;

	const book = allBooks.filter((b) => b.id === bookId)[0];

	if (book !== undefined) {
		return {
			status: "success",
			data: { book },
		};
	}

	const response = h.response({
		status: "fail",
		message: "Buku tidak ditemukan",
	});

	response.code(404);
	return response;
};

const editBookById = (request, h) => {
	const { bookId } = request.params;

	const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
	const updatedAt = new Date().toISOString();

	const index = allBooks.findIndex((book) => book.id === bookId);

	if (index) {
		const response = h.response({
			status: "fail",
			message: "Gagal memperbarui buku. Id tidak ditemukan",
		});

		response.code(404);
		return response;
	}

	if (!name) {
		const response = h.response({
			status: "fail",
			message: "Gagal memperbarui buku. Mohon isi nama buku",
		});

		response.code(400);
		return response;
	}

	if (readPage > pageCount) {
		const response = h.response({
			status: "fail",
			message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
		});

		response.code(400);
		return response;
	}

	if (index !== -1) {
		allBooks[index] = {
			...allBooks[index],
			name,
			year,
			author,
			summary,
			publisher,
			pageCount,
			readPage,
			reading,
			updatedAt,
		};

		const response = h.response({
			status: "success",
			message: "Buku berhasil diperbarui",
		});

		response.code(200);
		return response;
	}

	const response = h.response({
		status: "fail",
		message: "Buku gagal diperbarui",
	});

	response.code(404);
	return response;
};

const deleteBookById = (request, h) => {
	const { bookId } = request.params;

	const index = allBooks.findIndex((book) => book.id === bookId);

	if (index !== -1) {
		allBooks.splice(index, 1);
		const response = h.response({
			status: "success",
			message: "Buku berhasil dihapus",
		});
		response.code(200);
		return response;
	}

	const response = h.response({
		status: "fail",
		message: "Buku gagal dihapus. Id tidak ditemukan",
	});

	response.code(404);
	return response;
};

module.exports = { addBookHandler, getAllBooks, getBookById, editBookById, deleteBookById };
