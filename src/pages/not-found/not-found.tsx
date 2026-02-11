import classess from "./not-found.module.scss";

export const NotFoundPage: React.FC = () => {
  return (
    <div className={classess.container}>
      <p className={classess.title}>404</p>
      <p className={classess.caption}>
        Видимо вы здесь по ошибке? Вернитесь на главную. Если нет сообщите по
        контактам
      </p>
    </div>
  );
};
