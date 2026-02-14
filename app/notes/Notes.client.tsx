'use client';

import css from './page.module.css';

import { type Note } from '../../types/note';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchNotes } from '../../lib/api';
import { useDebouncedCallback } from 'use-debounce';
import NoteForm from '../../components/NoteForm/NoteForm';
import Modal from '../../components/Modal/Modal';
import NoteList from '../../components/NoteList/NoteList';
import SearchBox from '../../components/SearchBox/SearchBox';
import Pagination from '../../components/Pagination/Pagination';

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [isModal, setIsModal] = useState(false);
  const [word, setWord] = useState('');

  const { data } = useQuery({
    queryKey: ['notes', page, word],
    queryFn: () => fetchNotes(page, word),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    throwOnError: true,
  });

  function closeModal() {
    setIsModal(false);
  }

  function createBtn() {
    setIsModal(true);
  }

  const changeWord = useDebouncedCallback((newWord: string) => {
    setPage(1);
    setWord(newWord);
  }, 500);

  return (
    <div className={css.notes}>
      <div className={css.toolbar}>
        {/* Пропс залишаємо оригінальний, щоб не ламати типи */}
        <SearchBox changeWord={changeWord} />

        {data && data.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            setPage={setPage}
          />
        )}

        <button className={css.button} onClick={createBtn}>
          Create note +
        </button>
      </div>

      {data && data.notes.length > 0 && (
        <NoteList
          noteList={data.notes}
          setIsModal={setIsModal}
          setMessage={() => {}}
          setTypeModal={() => {}}
        />
      )}

      {isModal && (
        <Modal onClose={closeModal}>
          <NoteForm
            onCancel={closeModal}
            setIsModal={setIsModal}
            setMessage={() => {}}
            setTypeModal={() => {}}
          />
        </Modal>
      )}
    </div>
  );
}
