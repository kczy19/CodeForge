// src/store/roomStore.ts
import { create } from 'zustand';
import { Room, Participant } from '../types';

interface RoomStore {
  room: Room | null;
  currentUser: Participant | null;
  setRoom: (room: Room) => void;
  setCurrentUser: (user: Participant) => void;
  updateParticipant: (participant: Participant) => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  room: null,
  currentUser: null,
  setRoom: (room) => set({ room }),
  setCurrentUser: (user) => set({ currentUser: user }),
  updateParticipant: (participant) =>
    set((state) => ({
      room: state.room
        ? {
            ...state.room,
            participants: state.room.participants.map((p) =>
              p.id === participant.id ? participant : p
            ),
          }
        : null,
    })),
}));