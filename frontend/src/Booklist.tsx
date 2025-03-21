import { useEffect, useState } from 'react';
import { Book } from './types/Book';

function Booklist() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Sorting order state

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://localhost:5000/api/Book?page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`
        );
        const data = await response.json();
        setBooks(data.books);
        setTotalBooks(data.totalBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page, pageSize, sortOrder]); // Refetch data when sorting changes

  const totalPages = Math.ceil(totalBooks / pageSize);

  return (
    <div>
      <h1>Welcome to the Book Store!</h1>
      <br />

      <label>
        Books per page:
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>

      <button
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
      >
        Sort by Title {sortOrder === 'asc' ? '🔼' : '🔽'}
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        books.map((b) => (
          <div id="bookCard" className="card" key={b.bookID}>
            <h3 className="card-title">{b.title}</h3>
            <div className="card-body">
              <ul className="list-unstyled">
                <li>
                  <strong>Author: </strong>
                  {b.author}
                </li>
                <li>
                  <strong>Publisher: </strong>
                  {b.publisher}
                </li>
                <li>
                  <strong>ISBN: </strong>
                  {b.isbn}
                </li>
                <li>
                  <strong>Classification: </strong>
                  {b.classification}
                </li>
                <li>
                  <strong>Category: </strong>
                  {b.category}
                </li>
                <li>
                  <strong>Number of Pages: </strong>
                  {b.pageCount}
                </li>
                <li>
                  <strong>Price: </strong>${b.price.toFixed(2)}
                </li>
              </ul>
            </div>
          </div>
        ))
      )}

      {/* Pagination Controls */}
      <div>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>
          {' '}
          Page {page} of {totalPages}{' '}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Booklist;
