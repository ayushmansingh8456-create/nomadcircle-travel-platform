export interface Traveler {
  id: string;
  name: string;
  avatar: string;
  tag: string;
  tagColor: string;
  role: string;
}

export interface ChatMessage {
  id: string;
  authorId: string;
  text: string;
  time: string;
}

export interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  addedBy: string;
  art: string;
}

export const travelers: Traveler[] = [
  {
    id: 't1',
    name: 'Marcus Reed',
    avatar: 'https://images.pexels.com/photos/14950779/pexels-photo-14950779.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
    tag: 'Foodie',
    tagColor: 'ember',
    role: 'Trip Host',
  },
  {
    id: 't2',
    name: 'Aiko Tanaka',
    avatar: 'https://images.pexels.com/photos/14566062/pexels-photo-14566062.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
    tag: 'Night Owl',
    tagColor: 'teal',
    role: 'Traveler',
  },
  {
    id: 't3',
    name: 'David Okafor',
    avatar: 'https://images.pexels.com/photos/6102841/pexels-photo-6102841.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
    tag: 'Photographer',
    tagColor: 'gold',
    role: 'Traveler',
  },
  {
    id: 't4',
    name: 'Lena Brandt',
    avatar: 'https://images.pexels.com/photos/16869444/pexels-photo-16869444.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
    tag: 'History Buff',
    tagColor: 'teal',
    role: 'Traveler',
  },
  {
    id: 't5',
    name: 'Priya Sharma',
    avatar: 'https://images.pexels.com/photos/1820559/pexels-photo-1820559.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
    tag: 'Adventurer',
    tagColor: 'ember',
    role: 'Traveler',
  },
  {
    id: 't6',
    name: 'Sam Whitfield',
    avatar: 'https://images.pexels.com/photos/5308640/pexels-photo-5308640.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
    tag: 'Music Lover',
    tagColor: 'gold',
    role: 'Traveler',
  },
];

export const chatMessages: ChatMessage[] = [
  {
    id: 'm1',
    authorId: 't1',
    text: "Hey everyone! Welcome to the London cohort lounge. So pumped to finally meet you all. Drop a quick intro — where are you flying in from?",
    time: '2:04 PM',
  },
  {
    id: 'm2',
    authorId: 't2',
    text: "Hi! Aiko here, joining from Osaka. This is my first group trip — a little nervous but mostly excited for the nightlife!",
    time: '2:06 PM',
  },
  {
    id: 'm3',
    authorId: 't4',
    text: "Lena from Berlin. I've been twice before but never with a crew. Already mapped out a walking route through Westminster if anyone's in.",
    time: '2:08 PM',
  },
  {
    id: 'm4',
    authorId: 't3',
    text: "David from Lagos. Bringing two cameras and zero chill. That golden hour by Tower Bridge is going to be unreal.",
    time: '2:11 PM',
  },
  {
    id: 'm5',
    authorId: 't1',
    text: "Love the energy. Let's lock in Day 2 — afternoon tea at Sketch, then a stroll through Soho for dinner. Thoughts?",
    time: '2:14 PM',
  },
  {
    id: 'm6',
    authorId: 't5',
    text: "I'm in for Sketch! But can we add Camden Market earlier? I heard the vintage stalls open by 10 and I refuse to miss them.",
    time: '2:16 PM',
  },
  {
    id: 'm7',
    authorId: 't6',
    text: "Camden then Sketch works. Also — I'm curating a playlist for the trip. Add your favorite track in the sidebar and let's set the vibe early.",
    time: '2:18 PM',
  },
  {
    id: 'm8',
    authorId: 't2',
    text: "Done! Just added a track. Also, anyone else staying the night before? Want to grab a pint at the hotel bar?",
    time: '2:21 PM',
  },
];

export const playlistTracks: PlaylistTrack[] = [
  {
    id: 'p1',
    title: 'Midnight Drive',
    artist: 'The Neon Hours',
    duration: '3:42',
    addedBy: 'Sam',
    art: 'https://images.pexels.com/photos/5764281/pexels-photo-5764281.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
  },
  {
    id: 'p2',
    title: 'London Calling',
    artist: 'The Clash',
    duration: '3:20',
    addedBy: 'Marcus',
    art: 'https://images.pexels.com/photos/908965/pexels-photo-908965.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
  },
  {
    id: 'p3',
    title: 'Soho Lights',
    artist: 'Juno Fields',
    duration: '4:05',
    addedBy: 'Aiko',
    art: 'https://images.pexels.com/photos/31805824/pexels-photo-31805824.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
  },
  {
    id: 'p4',
    title: 'Camden Stroll',
    artist: 'River & Stone',
    duration: '2:58',
    addedBy: 'Priya',
    art: 'https://images.pexels.com/photos/2746823/pexels-photo-2746823.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
  },
];
