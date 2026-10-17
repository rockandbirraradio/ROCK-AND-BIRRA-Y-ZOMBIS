export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  year?: string;
  duration: string;
  genre: 'Psychobilly' | 'Horror Punk' | 'Garage Rock' | 'Punk Rock' | 'Indie' | 'Surf Rock';
  coverUrl?: string;
  url?: string;
  notes?: string;
}

export interface RadioShow {
  id: string;
  title: string;
  host: string;
  time: string;
  days: string[];
  description: string;
  genre: string;
  isLiveNow?: boolean;
  beerRecommendation: string;
}

export interface ListenerMessage {
  id: string;
  name: string;
  location: string;
  message: string;
  timestamp: string;
  beersDonated?: number;
  songRequest?: string;
}

export interface BeerReview {
  id: string;
  name: string;
  brewery: string;
  style: string;
  abv: string;
  ibu: number;
  rating: number; // 1-5
  pairingAlbum: string;
  pairingArtist: string;
  description: string;
  notes: string[];
}

export interface GameScore {
  score: number;
  zombiesKilled: number;
  wave: number;
  beersCollected: number;
  date: string;
}
