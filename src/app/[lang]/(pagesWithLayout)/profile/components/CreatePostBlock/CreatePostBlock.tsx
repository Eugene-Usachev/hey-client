"use client";
import React, {memo, FC, useState, useRef, Ref, useCallback, useEffect} from 'react';
import styles from './CreatePostBlock.module.scss';
import {TextArea} from "@/components/TextArea/TextArea";
import {AiOutlineEye} from "react-icons/ai";
import {RiSurveyLine} from "react-icons/ri";
import {Cross} from "@/components/Cross/Cross";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import {ProfileStore} from "@/stores/ProfileStore";
import {PostStore} from "@/stores/PostStore";
import {CreateSurveyDTO, PostDTO} from "@/app/[lang]/(pagesWithLayout)/profile/ProfileAPI";
import {SuccessAlert} from "@/components/Alerts/Alerts";
import {USERID} from "@/app/config";
import {observer} from "mobx-react-lite";

interface CreatePostBlockDict {
	WhatIsNew: string;
	Reset: string;
	Post: string;
	ToAll: string;
	ToFriends: string;
	Add: string;
	PossibleAnswer: string;
	Question: string;
	AnonymousSurvey: string;
	ManyAnswerOptions: string;
}

interface CreatePostBlockProps {
	dict: CreatePostBlockDict;
}

const colors1 = [
	'#C7D2DA',
	'linear-gradient(136deg, #fd7c6e 0%,#8000ff 100%)',
	'linear-gradient(136deg, #00a550 20%,#6600ff 80%)',
	'linear-gradient(136deg, #31408c 0%,#526fcc 100%)',
	'linear-gradient(123deg, #d93650 0%,#d99817 100%)',
	'linear-gradient(95deg, #ffa812 0%,#fefe22 100%)',
	'linear-gradient(133deg, #ff4252 0%,#6600ff 100%)',
];

const colors2 = [
	'linear-gradient(136deg, #fffafa 0%,#7fc7ff 100%)',
	'linear-gradient(136deg, #00a550 0%,#ffa500 100%)',
	'linear-gradient(136deg, #42aaff 0%,#6600ff 100%)',
	'linear-gradient(97deg, #707c8c 0%,#4d5565 100%)',
	'linear-gradient(96deg, #679945 0%,#2f733f 100%)',
	'linear-gradient(132deg, #2eb3b3 0%,#2552b3 100%)',
	'linear-gradient(170deg, #2aa691 0%,#13806d 100%)'
];

export const SurveyColor = [
	...colors1, ...colors2
]

export const CreatePostBlock: FC<CreatePostBlockProps> = observer<CreatePostBlockProps>(({dict}) => {

	const selfComponent = useRef<HTMLDivElement | null>(null);
	const [isActive, setIsActive] = useState(false);
	const [showSurveyForCreate, setShowSurveyForCreate] = useState(false);
	// surveyLines - First line is the question.
	const [surveyLines, setSurveyLines] = useState<string[]>(["", "", ""]);
	const [isAnonymousSurvey, setIsAnonymousSurvey] = useState(false);
	const [isManyAnswerOptions, setIsManyAnswerOptions] = useState(false);
	const [chosenColorForSurvey, setChosenColorForSurvey] = useState(0);
	const [isVisibleByChooseActive, setIsVisibleByChooseActive] = useState(false);
	const [visibleForAll, setVisibleForAll] = useState(true);
	const input = useRef<HTMLTextAreaElement | null>(null);
	const [creating, setCreating] = useState(false);

	const createPost = useCallback(() => {
		if (creating) return;
		setCreating(true);
		if (!input.current) {
			return;
		}
		const value = input.current?.textContent as string;
		const surveyLinesCleared = surveyLines.filter((str) => str !== "");

		if (value.length < 1 && surveyLinesCleared.length < 1) {
			return;
		}

		let surveyDTO: CreateSurveyDTO | null = null;
		if (surveyLinesCleared.length > 0) {
			surveyDTO = {
				background: chosenColorForSurvey,
				data: surveyLines,
				is_multi_voices: isManyAnswerOptions,
			};
		}

		const postDTO: PostDTO = {
			data: input.current!.textContent as string,
			files: [],
			have_survey: surveyDTO !== null,
		};

		PostStore.addPost(postDTO, surveyDTO)
			.then(res => {
				setCreating(false);
				if (res.status === 201) {
					input.current!.textContent = "";
					setSurveyLines(["", "", ""]);
					setIsAnonymousSurvey(false);
					setIsManyAnswerOptions(false);
					setChosenColorForSurvey(0);
					setVisibleForAll(true);
					setIsVisibleByChooseActive(false);
					setShowSurveyForCreate(false);
					setIsActive(false);
					SuccessAlert("Post created!");
				}
			});
	}, [surveyLines, input.current, chosenColorForSurvey, isManyAnswerOptions, creating]);/* TODO: visibleForAll*/

	useEffect(() => {
		if (+USERID == ProfileStore.id) {
			(selfComponent.current as HTMLDivElement).style.display = "flex";
		}
	}, [+USERID, selfComponent.current, ProfileStore.id]);

	return (
		<div ref={selfComponent} style={{display: "none"}} className={styles.createPostBlock + " " + (isActive ? styles.createPostBlockActive : "")} onClick={() => setIsActive(true)}>
			{isActive  &&
				<div style={{position: "fixed", top: '0', left: '0', zIndex: 998, width: '100vw', height: '100vh', cursor: 'default', backgroundColor: 'rgba(0, 0, 0, .05)'}}
				  	onClick={(e) => {
						  setIsActive(false);
				  	e.stopPropagation();
				  }}>
				</div>
			}
			<TextArea
				ref={input as Ref<HTMLDivElement>}
				className={isActive ? `${styles.input} ${styles.inputActive}` : `${styles.input} ${styles.placeholder}`}
				style={{height: isActive ? "auto" : "19px", zIndex: '1000'}}
				placeholder={dict.WhatIsNew}
				reg={"all"}
				maxLength={512}
				checkSpace={true}
				isActive={isActive}
				startValue={""}
			/>
			{isActive &&
				<>
                    <div className={styles.buttons_line}>
						<div style={{display: 'flex'}}>
                            <div style={{position: 'relative'}}>
                                <AiOutlineEye onClick={() => setIsVisibleByChooseActive(!isVisibleByChooseActive)} className={styles.icon}/>
								{
									isVisibleByChooseActive &&
                                    <div className={styles.chooseVisibleMenu}>
                                        <div className={`${styles.item} ${visibleForAll ? styles.active : ''}`} onClick={() => setVisibleForAll(true)}>
											{dict.ToAll}
                                        </div>
                                        <div className={`${styles.item} ${visibleForAll ? '' : styles.active}`} onClick={() => setVisibleForAll(false)}>
											{dict.ToFriends}
                                        </div>
                                    </div>
								}
                            </div>
							<RiSurveyLine className={styles.icon} onClick={() => setShowSurveyForCreate(!showSurveyForCreate)}/>
						</div>
						<div className={styles.postButton} onClick={createPost}>{dict.Post}</div>
                    </div>
					{showSurveyForCreate &&
						<div className={styles.surveyBlock} style={{background: chosenColorForSurvey > 6 ? colors2[chosenColorForSurvey - 7] : colors1[chosenColorForSurvey]}}>
							{surveyLines.map((content, index) => {
								return (
									<div style={{position: 'relative', width: '100%'}} key={index}>
										<input
											placeholder={index === 0 ? dict.Question : dict.PossibleAnswer}
											className={styles.line}
											value={content}
											maxLength={64}
											onChange={event => {
												setSurveyLines([...surveyLines.slice(0, index), event.target.value, ...surveyLines.slice(index + 1)])
											}}
										/>
										{index === surveyLines.length - 1 &&
											<>
												{index !== 2 && <Cross style={{position: 'absolute', top: '4px', right: '4px', padding: '2px'}} close={() => {setSurveyLines(surveyLines.slice(0, index))}}/>}
												{index !== 10 && <div className={styles.addLine} onClick={() => {
													setSurveyLines([...surveyLines, ''])
												}}>{dict.Add}</div>}
											</>
										}
									</div>
								)
							})}
							<div style={{marginTop: "10px", width: "max-content"}}>
								<div style={{display: "flex", alignItems: "center", justifyContent: 'space-between'}}>
									<div style={{paddingBottom: '2px'}}>{dict.AnonymousSurvey}</div>
									<Switch color="primary" checked={isAnonymousSurvey}
                                            onChange={(e) => setIsAnonymousSurvey(e.target.checked)}/>
								</div>
                                <div style={{display: "flex", alignItems: "center", justifyContent: 'space-between'}}>
									<div style={{paddingBottom: '2px'}}>{dict.ManyAnswerOptions}</div>
                                    <Switch color="primary" checked={isManyAnswerOptions}
                                            onChange={(e) => setIsManyAnswerOptions(e.target.checked)}/>
                                </div>
							</div>
							<div>
								{colors1.map((color, index) => {
									return <div key={index} style={{background: color}} className={styles.colorBlock} onClick={() => setChosenColorForSurvey(index)}></div>
								})}
							</div>
                            <div>
								{colors2.map((color, index) => {
									return <div key={index+7} style={{background: color}} className={styles.colorBlock} onClick={() => setChosenColorForSurvey(index+7)}></div>
								})}
                            </div>
						</div>
					}
				</>
			}
		</div>
	);
});