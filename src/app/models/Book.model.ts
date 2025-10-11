interface Book {
  BookId: string;
  Title: string;
  Slug: string;
  FileName: string;
  Link: string;
  AvatarPath: string;
  ExternalId: number;
  ExternalEncryptId: string;
  Description: string;
  TotalPage: number;
  PublicationYear: number;
  Summary: string;
  BookType: number;
  BookTypeAsString: string;
  CreatedDate: string; // hoặc Date nếu bạn muốn chuyển đổi
}

interface ReadBook {
  ReadBookId: string;
  UserId: string;
  BookId: string;
  Book: Book;
  ReadingStatus: string;
  CurrentPage: number;
  CreatedDate: string; // hoặc Date
  LastModifiedDate: string; // hoặc Date
}

export { Book, ReadBook };
