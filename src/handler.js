const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher,
        pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        name, year, author, summary, publisher, pageCount, readPage, reading, id, finished, insertedAt, updatedAt
    };

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        })
        response.code(400);
        return response;
    }

    if (parseInt(readPage) > parseInt(pageCount)) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        })
        response.code(400);
        return response;
    }

    books.push(newBook);

    const isSuccess = books.filter((b) => b.id === id).length > 0;

    if (!isSuccess) {
        const response = h.response({
            status: 'fail',
            message: 'Buku gagal ditambahkan',
        })
        response.code(500);
        return response;
    }

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id,
        },
    })
    console.log(books);
    response.code(201);
    return response;
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    let filteredBooks = books;

    if (name) {
        filteredBooks = filteredBooks.filter(book =>
            book.name.toLowerCase().includes(name.toLowerCase())
        )
    }

    if (reading !== undefined) {
        const isReading = reading === '1'
        filteredBooks = filteredBooks.filter(book => book.reading === isReading)
    }

    if (finished !== undefined) {
        const isFinished = finished === '1'
        filteredBooks = filteredBooks.filter(book => book.finished === isFinished)
    }

    const response = h.response({
        status: 'success',
        data: {
            books: filteredBooks.map(book => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }))
        }
    })

    response.code(200)
    return response
}

// function failedResp(stats, msg) {
//     const response = this.h.response({
//         status: stats,
//         message: msg
//     })
//     return response;
// }

// function failedResp(s, msg) {
//     this.response({
//         status: s,
//         message: msg
//     })
// }

function failedResp(s, msg) {
    return {
        status: s,
        message : msg
    }
}

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter((b) => b.id === id)[0];

    if (book === undefined) {
        const response = h.response(failedResp('fail', 'Buku tasd'));
        
        // const response = h.response({
        //     status: 'fail',
        //     message: 'Buku tidak ditemukan',
        // })
        response.code(404);
        return response;
    }

    const response = h.response({
        status: 'success',
        data: {
            book
        }
    })
    response.code(200)
    return response
}

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        })
        response.code(400);
        return response;
    }

    if (parseInt(readPage) > parseInt(pageCount)) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        })
        response.code(400);
        return response;
    }

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt
        }

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    };

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });
    response.code(404);
    return response;
}

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;


    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    };
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
}

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };