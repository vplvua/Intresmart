import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type IconSize = 'small' | 'medium' | 'large' | 'logo';
export type IconColor = 'primary' | 'secondary' | 'tertiary';

// Cases

export interface Case {
  id?: string;
  title: string;
  slug: string;
  launch: string;
  tag: string;
  home: boolean;
  homePage: {
    imageUrl: string;
    title: string;
  };
  imageCardUrl: string;
  imageCardSvg?: string;
  videoUrl?: string;
  page: {
    mainImgUrl: string;
    sideImgUrl: string;
    textField: string[];
    videoUrl?: string;
  };
  archive?: boolean;
}

export interface CaseFileUrls {
  mainImgUrl?: string;
  sideImgUrl?: string;
  imageCardUrl?: string;
  videoUrl?: string;
  imageCardSvg?: string;
}

export interface CaseFormData {
  title: string;
  launch: string;
  tag: string;
  textFields: string[];
  mainImg: File | null;
  sideImg: File | null;
  imageCard: File | null;
  video: File | null;
  svg: File | null;
}

export type CaseFormGroup = FormGroup<{
  title: FormControl<string>;
  launch: FormControl<string>;
  tag: FormControl<string>;
  textFields: FormArray<FormControl<string>>;
  mainImg: FormControl<File | null>;
  sideImg: FormControl<File | null>;
  imageCard: FormControl<File | null>;
  video: FormControl<File | null>;
  svg: FormControl<File | null>;
}>;

// Blog

export interface BlogPost {
  id?: string;
  title: string;
  subtitle: string;
  slug: string;
  date: string;
  content: {
    article: Article[];
    mainImgUrl?: string;
  };
  cardImgUrl: string;
  author: string;
  archive?: boolean;
}

export interface Article {
  header?: string;
  text?: string;
}

export interface BlogPostFileUrls {
  mainImgUrl?: string;
  cardImgUrl?: string;
}

export interface BlogPostFormData {
  title: string;
  subtitle: string;
  date: string;
  author: string;
  textFields: string[];
  mainImg: File | null;
  imageCard: File | null;
}

export type BlogPostFormGroup = FormGroup<{
  title: FormControl<string>;
  subtitle: FormControl<string>;
  date: FormControl<string>;
  author: FormControl<string>;
  textFields: FormArray<FormControl<string>>;
  mainImg: FormControl<File | null>;
  imageCard: FormControl<File | null>;
}>;

export interface ContentField {
  type: 'header' | 'text';
  value: string;
}
