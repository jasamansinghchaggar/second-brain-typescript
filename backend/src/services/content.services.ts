import Content, { IContent } from "../models/content.model";
import Tag, { ITag } from "../models/tags.model";

export const getAllContentByUserId = async (userId: string) => {
  return await Content.find({ userId }).populate('tags', 'title');
};

export const getContentById = async (id: string): Promise<IContent | null> => {
  return await Content.findOne({ _id: id });
};

export const createNewContent = async (
  contentToCreate: IContent
): Promise<IContent> => {
  const newContent = new Content(contentToCreate);
  return newContent;
};

export const deleteContentById = async (
  id: string,
  userId: string
): Promise<Boolean> => {
  const contentToDelete = await Content.findOneAndDelete({ _id: id, userId });
  return contentToDelete !== null;
};

export const getTagByTitle = async (title: string): Promise<ITag> => {
  return (await Tag.findOne({ title })) as ITag;
};

export const createTag = async (title: string): Promise<ITag> => {
  const tag = new Tag({ title });
  return await tag.save();
};
